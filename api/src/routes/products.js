const { Router } = require("express");


const {
  getRole
} = require("../handlers/routeProtection")


const { 
  sendEmail,
  productoPublicado,
 } = require("../mail/index");


const {
  searchByQuery,
  getProductsWithCategories,
  getProductById,
  createProduct,
  newProductBodyIsValid,
  findProductAndCategories,
  updateProduct,
  throwError,
  getUserById,
} = require("../handlers");
const { Product, Category, QandA, User } = require("../db");

const router = Router();

router
  .get("/", async (req, res) => {
    const { name = "", status = "", condition = "" } = req.query;
    const where = {
      name,
      status,
      condition,
    };
    try {
      if (name || status || condition) {
        const queryResult = await searchByQuery(where);
        return res.json(queryResult);
      }

      const allProductsWithCategories = await getProductsWithCategories();
      res.json(allProductsWithCategories);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .get('/byToken', getRole, async(req,res) => {
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const userProducts = await Product.findAll({
        where: {
          ownerId: id,
        },
        order: ["id"],
        include: [{
          model: Category,
          through: {
            attributes: [],
          },
        },
        {
          model: QandA,
          as: "productQAndA"
        }],
      })
      res.json(userProducts)
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const product = await getProductById(id);
      res.json(product.toJSON());
    } catch (error) {
      res.status(404).json(null);
    }
  })

  .post("/", getRole,async (req, res) => {
    const data = req.body;
    const {role, id} = req
    try {
      if (role === 'guest') throwError("You are not signed in",401)
      newProductBodyIsValid(data);
      data.status = "Publicado"
      const newProduct = await Product.create(data)
      if(!newProduct) throwError('Something went wrong at product creation', 400)
      await newProduct.setOwner(id);
      await newProduct.setCategories(data.categories)
      const fullUser = (await User.findByPk(id)).toJSON()
      
      const user = {
        name: fullUser.name,
        email: fullUser.emailAddress //para probar, estos datos deberian obtenerse desde la db
      } 
      
      const html = productoPublicado(user, data) //get personalized html template
      await sendEmail(user, 'Producto Publicado', html)
      res.status(201).json(`${data.name} successfully created`);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .put("/:productId", getRole,async (req, res) => {
    const { productId } = req.params;
    const body = req.body;
    const { categories } = req.body;
    const {id, role} = req
    try {
      if (role === 'guest') throwError("You are not signed in", 401)
      const user = (await getUserById(id)).toJSON()
      const ownsProduct = user.productsOwner.some((ele) => ele.id === parseInt(productId))
      if (role === 'user' && !ownsProduct) throwError("You cannot change a product which you do not own", 401)
      let updated = await updateProduct(productId, body);
      if(categories) {
        const { productToModify, categoriesToModify } =
        await findProductAndCategories(productId, categories);

        await productToModify.setCategories(categoriesToModify);
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .put("/addcategories/:id", async (req, res) => {
    // ** param id refers to product id **
    const { id } = req.params;
    const { categories } = req.body;

    try {
      const { productToModify, categoriesToModify } =
        await findProductAndCategories(id, categories);

      const updated = productToModify.addCategories(categoriesToModify);
      res.json(updated);
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .delete("/removecategories/:id", async (req, res) => {
    // ** param id refers to product id **
    const { id } = req.params;
    const { categories } = req.body;
    try {
      const { productToModify, categoriesToModify } =
        await findProductAndCategories(id, categories);

      const updated = productToModify.removeCategories(categoriesToModify);
      res.json(updated);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
