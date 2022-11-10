const { Router } = require("express");
const {
  getFavoritesDb,
  getFavoritesById,
  findFavoritesAndProduct,
  throwError,
  getUserById,
} = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

const router = Router();

router
.get("/", getRole,async (req, res) => {
  try {
    if (req.role !== 'admin') throwError('No tenés persmisos de administrador', 401)
    const favoritesDb = await getFavoritesDb();
    res.json(favoritesDb);
  } catch (error) {
    res.status(error.number || 400).json(error.message);
  }
})

.get('/byToken', getRole, async (req,res) => {
  const {id, role} = req
  try {
    if(role === 'guest') throwError('No iniciaste Sesión', 401);
    const user = await getUserById(id)
    if (!user) throwError('Usuario no Encontrado', 404)
    const singleFavList = await getFavoritesById(user.toJSON().favoritesUser.id);
    res.json(singleFavList)
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})

.get("/:id", getRole,async (req, res) => {
  const { id } = req.params;
  const {role} = req
  try {
    if (role !== 'admin') throwError('No tenés permisos de administrador', 401)
    const singleFavList = await getFavoritesById(id);
    res.json(singleFavList);
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  } 
})

.put('/addProductToFavList/byToken/:productId', getRole, async (req,res) => {
  const {role, id} = req;
  const {productId} = req.params
  try {
    if (role === 'guest') throwError('No iniciaste sesión', 401);
    const user = await getUserById(id);
    if (!user) throwError('Usuario no encontrado', 404);
    const { favListToAddModify, productToModify } = await findFavoritesAndProduct(user.toJSON().favoritesUser.id, productId);

    const exists = await favListToAddModify.hasProducts(productToModify)
    if (exists) throwError('El producto ya existe en la lista de favoritos',400)

    await favListToAddModify.addProduct(productId);
    res.json("Agregado con éxito!");
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})

.delete("/removeProductFromFavList/byToken/:productId", getRole, async (req, res) => {
  const {role, id} = req;
  const {productId} = req.params
  try {
    if (role === 'guest') throwError('No iniciaste sesión', 401);
    const user = await getUserById(id);
    if (!user) throwError('Usuario no encontrado', 404);
    const { favListToAddModify, productToModify } = await findFavoritesAndProduct(user.toJSON().favoritesUser.id, productId);
    
    const exists = await favListToAddModify.hasProducts(productToModify)
    if (!exists) throwError('El producto no se encontró en la lista de favoritos',400)
    
    await favListToAddModify.removeProduct(productId);
    res.json("Quitado con éxito!");
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})

  .delete("/clearFavList/byToken", getRole,async (req, res) => {
    const {role, id} = req;
    try {
      if (role === 'guest') throwError('No iniciaste sesión', 401);
      const user = await getUserById(id);
      if (!user) throwError('Usuario no encontrado', 404);
      const favListToClear = await getFavoritesById(user.toJSON().favoritesUser.id);
      await favListToClear.setProducts([]);
      res.json('Lista de favoritos limpiada con éxito');
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  });

module.exports = router;
