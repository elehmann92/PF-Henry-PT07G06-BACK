const { Router } = require("express");
const { Transaction, User, ShoppingOrder } = require("../db");
const { getCartById } = require("../handlers");

const router = Router();

router
  .post("/:userId", async (req, res) => {
    try {
      const {userId} = req.params  
      const newTransaction = await Transaction.create({userId: userId, state: 'pending'})
      const cart = await getCartById(userId)

      cart.dataValues.products.forEach(el => {
        ShoppingOrder.create({
          state:'pending' , 
          sellerId: el.ownerId , 
          productId: el.id , 
          transactionId: newTransaction.id, 
          buyerId: userId})
      });
      await cart.setProducts([])
      res.json(newTransaction);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })


module.exports = router;