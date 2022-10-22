const { Router } = require("express");

const {
  searchByQuery,
  getProductsWithCategories,
  getProductById,
  createProduct,
  newProductBodyIsValid,
  findProductAndCategories,
  updateProduct,
} = require("../handlers");

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

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const product = await getProductById(id);
      res.json(product.toJSON());
    } catch (error) {
      res.status(404).json(null);
    }
  })

  .post("/", async (req, res) => {
    const data = req.body;
    try {
      newProductBodyIsValid(data);
      const newProduct = await createProduct(data);
      res.status(201).json(`${data.name} successfully created`);
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .put("/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
      const updated = await updateProduct(id, body);

      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json(error.message);
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
