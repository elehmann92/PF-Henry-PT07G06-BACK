const { Router } = require("express");
const { Cart, Product } = require("../db");
const { getCartsDb, getCartById, findCartAndProduct, throwError, getUserById } = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

const router = Router();

router
  .get("/", getRole,async (req, res) => {
    try {
      if (req.role !== 'admin') throwError('You are not Admin', 401)
      const cartsDb = await getCartsDb();
      res.json(cartsDb);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .get('/byToken', getRole, async (req,res) => {
    const {id, role} = req
    try {
      if(role === 'guest') throwError('You are not signed in', 401);
      const user = await getUserById(id)
      if (!user) throwError('User not found', 404)
      const singleCart = await getCartById(user.toJSON().cartUser.id);
      res.json(singleCart)
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })
  
  .get("/:id", getRole,async (req, res) => {
    const { id } = req.params;
    const {role} = req
    try {
      if (role !== 'admin') throwError('You are not Admin', 401)
      const singleCart = await getCartById(id);
      res.json(singleCart);
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })
  
  .put('/addProductToCart/byToken/:productId', getRole, async (req,res) => {
    const {role, id} = req;
    const {productId} = req.params
    try {
      if (role === 'guest') throwError('You are not signed in', 401);
      const user = await getUserById(id);
      if (!user) throwError('User not found', 404);
      const { cartToModify, productToModify } = await findCartAndProduct(user.toJSON().cartUser.id, productId);

      if (productToModify.toJSON()?.status !== "Publicado") throwError('Selected product is not available for purchasing at the moment',400)

      const exists = await cartToModify.hasProducts(productToModify)
      if (exists) throwError('Product already exists in cart',400)

      await cartToModify.addProduct(productId);
      const price = productToModify.toJSON().price
      await cartToModify.update({total:  cartToModify.toJSON().total + price});
      res.json("Successfully added");
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })
  
  .delete("/removeProductFromCart/byToken/:productId", getRole, async (req, res) => {
    const {role, id} = req;
    const {productId} = req.params
    try {
      if (role === 'guest') throwError('You are not signed in', 401);
      const user = await getUserById(id);
      if (!user) throwError('User not found', 404);
      const { cartToModify, productToModify } = await findCartAndProduct(user.toJSON().cartUser.id, productId);
      
      const exists = await cartToModify.hasProducts(productToModify)
      if (!exists) throwError('Product wasn`t found in cart',400)
      
      await cartToModify.removeProduct(productId);
      const price = productToModify.toJSON().price
      await cartToModify.update({total: cartToModify.toJSON().total - price})
      res.json("Successfully removed");
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })

  .delete("/clearCart/byToken", getRole,async (req, res) => {
    const {role, id} = req;
    try {
      if (role === 'guest') throwError('You are not signed in', 401);
      const user = await getUserById(id);
      if (!user) throwError('User not found', 404);
      const cartToClear = await getCartById(user.toJSON().cartUser.id);
      await cartToClear.setProducts([]);
      res.json(`Cart successfully cleared`);
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })

module.exports = router;
