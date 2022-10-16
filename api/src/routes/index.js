const { Router } = require("express");
const productsRouter = require("./products");
const categoriesRouter = require("./categories");

const router = Router();

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);

module.exports = router;
