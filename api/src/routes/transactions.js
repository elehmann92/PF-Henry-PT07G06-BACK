const { Router } = require("express");
const { Op , Model} = require("sequelize");
const { Transaction, Balance, User, ShoppingOrder, Product, Reviews} = require("../db");
const { getTransactions, getInstanceById, throwError} = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

const { 
  sendEmail,
  productoEnviado,
  productoRecibido,
 } = require("../mail/index");

const router = Router();

router.get("/", getRole, async (req, res) => {
  try {
    const {role} = req
    if(role !== 'admin') throwError('You are not Authorized', 401)
    const transactions = await getTransactions()
    res.json(transactions)
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})

.get('/byToken', getRole, async (req, res) => {
  const { role } = req;
  const id = parseInt(req.id);
  try {
    if (role === "guest") throwError("You are not Authorized", 401);
    const userTrasactions = await Transaction.findAll({
      where: {
        [Op.or]: [{ buyerId: id }, { sellerId: id }],
      },
      include: [
        {
          model: ShoppingOrder,
          as: "shoppingOrder",
        },
        { model: Product,
          as: "product",
          include: {
            model: Reviews,
            as:"productReviewed"
          }
        },
      ],
    });

    const asBuyer = userTrasactions.filter(ele => ele.buyerId === id)
    const asSeller = userTrasactions.filter(ele => ele.sellerId === id)

    res.json({
      transactions: {
        asBuyer,
        asSeller,
      },
    });
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
  
})

.get('/:transactionId', getRole,async (req, res) => {
  const {transactionId} = req.params;
  const {role, id} = req
  try {
    if(role === 'guest') throwError('You are not Authorized', 401)

    const transaction = await getInstanceById(Transaction,transactionId)
    const {sellerId, buyerId} = transaction
    if (role === 'user' && sellerId !== parseInt(id) && buyerId !== parseInt(id)) throwError('You are not Authorized', 401)

    res.json(transaction)
  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})


.put("/:transactionId", getRole, async (req,res) => {
  const {transactionId} = req.params;
  const body = req.body
  const {role, id} = req
  try {
    if (!body || !Object.keys(body)?.length) throwError('No info provided to update', 400)
    if(role === 'guest') throwError('You are not Authorized', 401)
    const transactionToUpdate = await getInstanceById(Transaction,transactionId);
    const {sellerId, buyerId} = transactionToUpdate
    if (role === 'user' && sellerId !== parseInt(id) && buyerId !== parseInt(id)) throwError('You are not Authorized', 401)
    const updated = transactionToUpdate.set(body)
    
    await transactionToUpdate.save()

    const buyerWithInfo = (await User.findByPk(buyerId)).toJSON()
    const sellerWithInfo = (await User.findByPk(sellerId)).toJSON()

    if(body.state === "closed"){
      //restar balance
      const balance = await Balance.findByPk('1')
      const total = transactionToUpdate.toJSON().total
      await balance.update({total:  balance.toJSON().total - total})

      //Cerrar shopping order si es la ultima transaction a cerrar
      const shoppingOrderDb = await ShoppingOrder.findByPk(transactionToUpdate.toJSON().shoppingOrderId, {
        include: { model: Transaction, as: "transactionList" },
      })

      const shoppingOrder = shoppingOrderDb.toJSON()

      let check = shoppingOrder.transactionList.filter(el => el.state === 'closed')
      if (check.length === shoppingOrder.transactionList.length) {
        shoppingOrderDb.update({state: 'closed'})

      }
    }

    if (body.state === 'cancelled') {
      let product = await Product.findByPk(transactionToUpdate.toJSON().productId)
      product.update({status: 'Publicado'})
    }

    // ** PENDIENTE -> ENVIAR UN CORREO AL COMPRADOR CUANDO EL PRODUCTO SE DESPACHA Y ENVIAR UN CORREO AL VENDEDOR CUANDO EL PRODUCTO SE RECIBE**
    if (body.state === 'sent') {
      const user = {
        name: buyerWithInfo.name ? buyerWithInfo.name : buyerWithInfo.emailAddress, //en caso de que no haya nombre registrado, usar el mail como nombre
        email: buyerWithInfo.emailAddress,
      }
      const html = productoEnviado(user)
      await sendEmail(user, `Tu producto ha sido enviado`, html)
    } else {
      const user = {
        name: sellerWithInfo.name ? sellerWithInfo.name : sellerWithInfo.emailAddress, //en caso de que no haya nombre registrado, usar el mail como nombre
        email: sellerWithInfo.emailAddress,
      }
      const html = productoRecibido(user)
      await sendEmail(user, `El producto que vendiste ya fue recibido`, html)
    }


    res.json(updated)

  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})


module.exports = router;
