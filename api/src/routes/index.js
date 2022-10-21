const { Router } = require("express");
const productsRouter = require("./products");
const categoriesRouter = require("./categories");
const usersRouter = require("./users");
const cartRouter = require("./cart");

const router = Router();

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);

module.exports = router;
