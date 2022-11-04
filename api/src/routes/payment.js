const { Router } = require("express");
const { Category, ShoppingOrder } = require("../db");
const { getRole } = require("../handlers/routeProtection");
const axios = require("axios");

const router = Router();
const PaymentController = require("../Controllers/PaymentControllers");
const PaymentService = require("../Service/PaymentsService");
const { throwError } = require("../handlers");
const PaymentInstance = new PaymentController(new PaymentService());

router.get("/", getRole, async (req, res) => {
  try {
    const id = req.query.id;
    if(!id) throwError('There is no shopping order created')
    if(req.role === 'guest') throwError('You are not Authorized', 401)
    PaymentInstance.getPaymentLink(req, res, id);
  } catch (error) {
    res.status(error.number || 400).json(error.message);
  }
});

router.post("/response", async (req, res) => {
  // const { topic, action } = req.body;

  // try {
  //   if (topic === "merchant_order") {
  //     const merchantOrder = await axios.get(req.body.resource, {
  //       headers: {
  //         "Content-Type": "aplication/json",
  //         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  //       },
  //     });

  //     if (!merchantOrder) throw new Error("No merchant order was found");

  //     const shoppingOrder = await ShoppingOrder.findOne({
  //       where: {
  //         preference_id: merchantOrder.data.preference_id,
  //       },
  //     });

  //     if (!shoppingOrder) throw new Error("No shopping order was found");

  //     const updated = await shoppingOrder.update({
  //       merchant_id: merchantOrder.data.id,
  //     });
  //     return res.json(updated)
  //   }

  //   if (action === "payment.updated") {
  //     const paymentStatus = await axios.get(
  //       `https://api.mercadopago.com/v1/payments/${req.body.data.id}`,
  //       {
  //         headers: {
  //           "Content-Type": "aplication/json",
  //           Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  //         },
  //       }
  //     );

  //     if (!paymentStatus) throw new Error('No payment order was found')
  //     const shoppingOrder = await ShoppingOrder.findOne({where:{
  //       merchant_id: paymentStatus.data.order.id
  //     }})
  //     if (!shoppingOrder) throw new Error("No shopping order was found");
      
  //     const updated = shoppingOrder.set({
  //       payment_id: paymentStatus.data.id,
  //       paymentReceived: paymentStatus.data.status === "approved" ? true : false,
  //       state: paymentStatus.data.status,
  //     })
  //     return res.json(updated)
  //   }
  // } catch (error) {
  //   return res.status(400).json(error.message)
  // }

  // console.log("entro succes", req.body);
  // console.log("RESCATO EL ID ", req.body?.data?.id || "no lo encontre");

  res.send("ACA VAN A SALIR LOS BODIES DEL POST /PAYMENT/RESPONSE");
});

router.get("/idStatus/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paymentStatus = await axios.get(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          "Content-Type": "aplication/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
    res.json(paymentStatus?.data?.status || "pending");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
