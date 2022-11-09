const { Router } = require("express");
const { Transaction, User, ShoppingOrder, Product, Cart, Balance } = require("../db");
const { getRole } = require("../handlers/routeProtection");
const {
  getCartById,
  getProductById,
  updateProduct,
  getShoppingOrderListWithDetails,
  getShoppingOrderById,
  getUserById,
  throwError
} = require("../handlers");
const { sendEmail, ordenCreada, ordenPagada, enviarContactoAlVendedor, enviarContactoAlComprador } = require("../mail/index");

const router = Router();

router
  .post("/byToken", getRole, async (req, res) => {
    const {role, id} = req;
    try {
      if(role === 'guest') throwError('You are not Authorized', 401)
      const dbCart = await Cart.findOne({where: {cartUserId: id}})
      const cartId = dbCart.toJSON().id
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

      let totalCart = 0
      cartJSON.products.forEach(ele => {
        console.log("ELE.PRICE --->",ele.price)
        return totalCart += ele.price
      })

      // console.log("TOTAL CARRITO DE COMPRAS -->",totalCart)

      const newShoppingOrder = await ShoppingOrder.create({
        cartId: cartId,
        state: "pending",
        total: totalCart,
        // total: cartJSON.total,
        paymentReceived: false,
      });

      const transaccionCreate = cartJSON.products.map((el) => {
        return Transaction.create({
          state: "pending",
          sellerId: el.ownerId,
          productId: el.id,
          shoppingOrderId: newShoppingOrder.id,
          buyerId: cartJSON.cartUserId,
          total: el.price,
        });
      });

      const updateProductState = cartJSON.products.map((el) =>
        updateProduct(el.id, {
          status: "No Disponible",
        })
      );

      await Promise.all(transaccionCreate);
      await Promise.all(updateProductState);

      await cart.setProducts([]);
      await cart.update({ total: 0 });

      const orderDetail = await getShoppingOrderById(newShoppingOrder.id);
      const products = orderDetail.transactionList.map((p) => p.productId);
      const productDetail = await Product.findAll({
        where: {
          id: products,
        },
      });
      // console.log("PRODUCT DETAIL PARA MAIL ->",productDetail)

      const fullUser = (await User.findByPk(id)).toJSON()
      
      const user = {
        name: fullUser.name,
        email: fullUser.emailAddress //para probar, estos datos deberian obtenerse desde la db
      } 

      const html = ordenCreada(user, newShoppingOrder, productDetail);
      await sendEmail(user, "Nueva orden de compra", html);

      newShoppingOrder

      res.json(newShoppingOrder);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .get("/", getRole,async (req, res) => {
    const {role, id} = req
    try {
      if (role !== 'admin') throwError('You are not an admin', 401)
      const shoppingOrderList = await getShoppingOrderListWithDetails();
      res.json(shoppingOrderList);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .get('/byToken', getRole, async(req, res) => {
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const user =  (await getUserById(id)).toJSON()
      res.json(user?.cart || [])   
    } catch (error) {
      res.status(error.number || 400).json(error.message)
    }
  })

  .get("/:shoppingOrderId", async (req, res) => {
    const { shoppingOrderId } = req.params;
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const shoppingOrder = await getShoppingOrderById(shoppingOrderId);
      const buyer = shoppingOrder.toJSON().transactionList[0].buyerId
      if (role === 'user' && parseInt(id) !== parseInt(buyer)) throwError('You can not request a shopping order which you do not own', 401)
      res.json(shoppingOrder);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .put("/mpresponse",getRole, async (req, res) => {
    const { status, payment_id, merchant_order_id, preference_id } = req.body;
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      if (!preference_id) throw new Error("Missing preference ID");

      const shoppingOrder = await ShoppingOrder.findOne({
        where: {
          preference_id,
        },
      });

      if (!shoppingOrder)
        throw new Error(
          "No shopping order was found according to the provided preference ID"
        );

      const updated = shoppingOrder.set({
        payment_id,
        merchant_id: merchant_order_id,
        paymentReceived: status === "approved" ? true : false,
        state: status === "approved" ? "in process": "pending",
      });
      await shoppingOrder.save();
      
      const fullUser = (await User.findByPk(id)).toJSON()
      
      const orderDetail = await getShoppingOrderById(shoppingOrder.id);
      const products = orderDetail.transactionList.map((p) => p.productId);
      const productDetail = await Product.findAll({
        where: {
          id: products,
        },
      });
      
      const user = {
        name: fullUser.name,
        email: fullUser.emailAddress 
      } 
      if(status === "approved"){
        const balance = await Balance.findByPk('1')
        const total = shoppingOrder.toJSON().total
        await balance.update({total:  balance.toJSON().total + total});
        
        const sellers = await Promise.all(orderDetail.transactionList.map(async (p) => (await User.findByPk(p.sellerId)).toJSON()))
        await Promise.all(sellers.map( async (seller) => {
          const data = {
            name: seller.name,
            email: seller.emailAddress
          }
          const html = enviarContactoAlVendedor(user, seller);
          await sendEmail(data, `Vendedor. Coordina el envio de tu producto.`, html); 
        }))
        const html = enviarContactoAlComprador(user, sellers);
        await sendEmail(user, "Comprador. Coordina el envio de tu producto.", html);
      }
      
      const html = ordenPagada(user, updated, productDetail);
      await sendEmail(user, "Cambio de estatus en tu orden de compra", html);

      res.json(updated);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .put("/:shoppingOrderid", getRole,async (req, res) => {
    const { shoppingOrderid } = req.params;
    const body = req.body;
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const shoppingOrderToUpdate = await getShoppingOrderById(shoppingOrderid);
      const buyer = shoppingOrderToUpdate.toJSON().transactionList[0].buyerId
      if (role === 'user' && parseInt(id) !== parseInt(buyer)) throwError('You can not update a shopping order which you do not own', 401)

      const updated = shoppingOrderToUpdate.set(body);
      await shoppingOrderToUpdate.save();

      res.json(updated);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
