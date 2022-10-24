const { Router } = require("express");
const { Category } = require("../db");
const axios = require("axios");

const router = Router();
const PaymentController = require("../Controllers/PaymentControllers");
const PaymentService = require("../Service/PaymentsService");
const PaymentInstance = new PaymentController(new PaymentService());

router.get("/", async (req, res) => {
  const id = req.query.id
  
  
  PaymentInstance.getPaymentLink(req, res,id);
});

router.post("/response", async (req, res) => {
  console.log("entro succes",req.body)
  console.log("RESCATO EL ID ", req.body?.data?.id || "no lo encontre")
  
  res.send(req.body)
});


router.get("/idStatus/:id", async (req,res) => {
  const {id} = req.params
  try {
    const paymentStatus = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`,{
      headers: {
        "Content-Type": "aplication/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      }})
      res.json(paymentStatus?.data?.status || "pending")
  } catch (error) {
    res.status(400).json(error.message)
  }
})


module.exports = router;