const { Router } = require("express");
const { Transaction, User, ShoppingOrder } = require("../db");
const { getCartById } = require("../handlers");

const router = Router();

router
  .post("/:cartId", async (req, res) => {
    try {
      const {cartId} = req.params  
      const newShoppingOrder = await ShoppingOrder.create({cartId: cartId, state: 'pending'})
      const cart = await getCartById(cartId)

      cart.dataValues.products.forEach(el => {
        Transaction.create({
          state:'pending' , 
          sellerId: el.ownerId , 
          productId: el.id , 
          shoppingOrderId: newShoppingOrder.id, 
          buyerId: cartId})
      });
      await cart.setProducts([])
      res.json(newShoppingOrder);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })


module.exports = router;