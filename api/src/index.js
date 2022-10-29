const { Router } = require("express");
const productsRouter = require("./products");
const categoriesRouter = require("./categories");
const usersRouter = require("./users");
const cartRouter = require("./cart");
const favoritesRouter = require("./favorites");
const shoppingOrdersRouter = require("./shoppingOrders")
const transactionsRouter = require("./transactions")
const reviewsRouter = require("./reviews")
const qaRouter= require("./Q&A")

const router = Router();

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);
router.use("/favorites", favoritesRouter);
router.use("/shoppingOrders", shoppingOrdersRouter);
router.use("/transactions", transactionsRouter);
router.use("/reviews", reviewsRouter);
router.use("/Q&A", qaRouter);

module.exports = router;
