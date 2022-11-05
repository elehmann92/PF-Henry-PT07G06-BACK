const { Router } = require("express");
const { Transaction, Balance } = require("../db");
const { getTransactions, getInstanceById} = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

const router = Router();

router.get("/", getRole, async (req, res) => {
  try {
    const {role} = req
    if(role !== 'admin') throwError('You are not Authorized', 401)
    const transactions = await getTransactions()
    res.json(transactions)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

.get('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const transaction = await getInstanceById(Transaction,id)
    res.json(transaction)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

.put("/:id", getRole, async (req,res) => {
  const {id} = req.params;
  const body = req.body
  try {
    const {role} = req
    if(role !== 'admin') throwError('You are not Authorized', 401)
    const transactionToUpdate = await getInstanceById(Transaction,id);
    
    const updated = transactionToUpdate.set(body)
    
    await transactionToUpdate.save()

    if(body.state === "closed"){
      const balance = await Balance.findByPk('1')
      const total = transactionToUpdate.toJSON().total
      await balance.update({total:  balance.toJSON().total - total});
    }
    res.json(updated)

  } catch (error) {
    res.status(400).json(error.message)
  }
})


module.exports = router;
