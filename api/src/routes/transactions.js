const { Router } = require("express");
const { Op } = require("sequelize");
const { Transaction, Balance } = require("../db");
const { getTransactions, getInstanceById, throwError} = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

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
        [Op.or]: [
          { buyerId: id },
          { sellerId: id }
        ],
      },
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

    if(body.state === "closed"){
      const balance = await Balance.findByPk('1')
      const total = transactionToUpdate.toJSON().total
      await balance.update({total:  balance.toJSON().total - total});
    }
    res.json(updated)

  } catch (error) {
    res.status(error.number || 400).json(error.message)
  }
})


module.exports = router;
