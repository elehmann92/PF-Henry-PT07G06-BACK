const { Router } = require("express");
const { Cart, Product } = require("../db");
const { getCartsDb, getCartById, findCartAndProduct } = require("../handlers");

const router = Router();
const PaymentController = require("../Controllers/PaymentControllers");
const PaymentService = require("../Service/PaymentsService");
const PaymentInstance = new PaymentController(new PaymentService());

router.get("/", async (req, res) => {
  console.log("entro")
 
  PaymentInstance.getPaymentLink(req, res);
});

router.get("/succes", async (req, res) => {
  console.log("entro succes")
 
  res.send("exitos")
});



module.exports = router;
