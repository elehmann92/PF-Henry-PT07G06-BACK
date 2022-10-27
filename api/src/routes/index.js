const { Router } = require("express");
const productsRouter = require("./products");
const categoriesRouter = require("./categories");
const usersRouter = require("./users");
const cartRouter = require("./cart");
const favoritesRouter = require("./favorites");
const shoppingOrdersRouter = require("./shoppingOrders")
const transactionsRouter = require("./transactions")

const router = Router();

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);
router.use("/favorites", favoritesRouter);
router.use("/shoppingOrders", shoppingOrdersRouter);
router.use("/transactions", transactionsRouter);

module.exports = router;
