const { Router } = require("express");
const productsRouter = require("./products");
const categoriesRouter = require("./categories");
const usersRouter = require("./users");
const cartRouter = require("./cart");
const favoritesRouter = require("./favorites");
const shoppingOrdersRouter = require("./shoppingOrders");
const transactionsRouter = require("./transactions");
const paymentRoute = require("./payment");
const qAndARouter = require("./Q&A");
const reviewsRouter = require("./reviews");
const balanceRouter = require("./balance")
const { sessionLoginRouter } = require("./sessionLogin");

const router = Router();

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);
router.use("/favorites", favoritesRouter);
router.use("/shoppingOrders", shoppingOrdersRouter);
router.use("/transactions", transactionsRouter);
router.use("/payment", paymentRoute);
router.use("/sessionLogin", sessionLoginRouter);
router.use("/Q&A", qAndARouter);
router.use("/reviews", reviewsRouter);
router.use("/balance" , balanceRouter)

module.exports = router;
