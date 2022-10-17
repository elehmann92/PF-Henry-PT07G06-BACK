const { Router } = require("express");
const { restart } = require("nodemon");
const {
  searchByQuery,
  getProductsWithCategories,
  getProductById,
  createProduct
} = require("../handlers");

const router = Router();

router
  .get("/", async (req, res) => {
    const { name } = req.query;
    try {
      if (name) {
        const queryResult = await searchByQuery(name);
        return res.json(queryResult);
      }

      const allProductsWithCategories = await getProductsWithCategories();
      res.json(allProductsWithCategories);
    } catch (error) {
      res.status(404).json(error.message);
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
  
  .post("/", async (req,res) => {
    const data = req.body
    try {
      const newProduct = await createProduct(data)
      res.status(201).json(`${data.name} successfully created`)
    } catch (error) {
      res.status(404).json(error.message)
    }
  });

module.exports = router;
