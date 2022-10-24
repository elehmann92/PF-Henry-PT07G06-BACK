const { ShoppingOrder } = require("../db");

class PaymentController {
    constructor(subscriptionService) {
      this.subscriptionService = subscriptionService;
    }
  
    async getPaymentLink(req, res,id) {
      try {
        const payment = await this.subscriptionService.createPayment(id);

        if(payment) {
          const collectorId = payment.collector_id
  
          const shoppingOrder = await ShoppingOrder.findByPk(id)
          if(collectorId) {
            await shoppingOrder.update({collector_id: collectorId})
            await shoppingOrder.save()
          }
        }
  
        return res.json(payment);
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create payment" });
      }
    }
  
   
  }
  
  module.exports = PaymentController;