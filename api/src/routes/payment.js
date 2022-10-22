const { Router } = require("express");
const { Cart, Product } = require("../db");
const { getCartsDb, getCartById, findCartAndProduct } = require("../handlers");

const router = Router();
const PaymentController = require("");
const PaymentService = require("");
const PaymentInstance = new PaymentController(new PaymentService());

router.get("/", async (req, res) => {
  console.log("entro")
  PaymentInstance.getPaymentLink(req, res);
});

module.exports = router;
