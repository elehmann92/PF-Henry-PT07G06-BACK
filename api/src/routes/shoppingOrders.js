const { Router } = require("express");
const { Transaction, User, ShoppingOrder } = require("../db");
const { getCartById, getProductById, updateProduct, getShoppingOrderListWithDetails, getShoppingOrderById } = require("../handlers");
const { 
  sendEmail,
  ordenCreada,
  ordenPagada,
 } = require("../mail/index");
 
const user = {
  name: 'Usuario',
  email: 'jonatan2502@gmail.com' //para probar, estos datos deberian obtenerse desde la db
} 


const router = Router();

router.post("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await getCartById(cartId);
    const cartJSON = cart.toJSON();
    if (!cartJSON.products?.length) {
      return res.status(404).json("There are no products listed to confirm");
    }
    // Before creating shopping order, check if are there any unavailable products
    cartJSON.products.forEach((product) => {
      if (product.status !== "Publicado")
        throw new Error(
          `Sadly, product ${product.id}. ${product.name} is currently unavailable for purchasing. Remove it from the list in order to proceed with the shopping order`
        );
    });

    const newShoppingOrder = await ShoppingOrder.create({
      cartId: cartId,
      state: "pending",
      total: cartJSON.total,
      paymentReceived: false
    });

    cartJSON.products.forEach(async (el) => {
      Transaction.create({
        state: "pending",
        sellerId: el.ownerId,
        productId: el.id,
        shoppingOrderId: newShoppingOrder.id,
        buyerId: cartJSON.cartUserId,
        total: el.price
      });
      await updateProduct(el.id, {
        status: "No Disponible",
      });
    });
    await cart.setProducts([]);
    await cart.update({total: 0});

    const html = ordenCreada(user, newShoppingOrder)
    await sendEmail(user, 'Nueva orden de compra', html)

    res.json(newShoppingOrder);
  } catch (error) {
    res.status(404).json(error.message);
  }
})

.get("/", async(req,res) => {
  try {
    const shoppingOrderList = await getShoppingOrderListWithDetails()
    res.json(shoppingOrderList)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

 .get("/:id", async (req,res) => {
  const {id} = req.params
  try {
    const shoppingOrder = await getShoppingOrderById(id)
    res.json(shoppingOrder)
  } catch (error) {
    res.status(400).json(error.message)
  }
 })

 .put("/mpresponse", async(req,res) => {
    const {status,payment_id,merchant_order_id,preference_id} = req.body
    try {
      
      if (!preference_id) throw new Error('Missing preference ID')
      
      const shoppingOrder = await ShoppingOrder.findOne({where:{
        preference_id
      }})

      if(!shoppingOrder) throw new Error('No shopping order was found accordint to the provided preference ID')

      const updated = shoppingOrder.set({
        payment_id: payment_id,
        merchant_id: merchant_order_id,
        paymentReceived: status === "approved" ? true : false
      })
      await shoppingOrder.save()

      const html = ordenPagada(user, updated)
      await sendEmail(user, 'Cambio de estatus en tu orden de compra', html)

      res.json(updated)
    } catch (error) {
      res.status(400).json(error.message)
    }
  })

 .put('/:id', async(req,res) => {
    const {id} = req.params;
    const body = req.body
    try {
      if (!id) throw new Error('Missing ID')
      const shoppingOrderToUpdate = await getShoppingOrderById(id)
      const updated = shoppingOrderToUpdate.set(body)
      await shoppingOrderToUpdate.save()

      res.json(updated)

    } catch (error) {
      res.status(400).json(error.message)
    }
 })



module.exports = router;
