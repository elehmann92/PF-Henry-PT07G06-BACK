const { Router } = require("express");
const { Transaction } = require("../db");
const { getTransactions, getInstanceById } = require("../handlers");

const router = Router();

router.get("/", async (req, res) => {
  try {
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

.put("/:id", async (req,res) => {
  const {id} = req.params;
  const body = req.body
  try {
    const transactionToUpdate = await getInstanceById(Transaction,id);
    const updated = transactionToUpdate.set(body)
    await transactionToUpdate.save()
    res.json(updated)

  } catch (error) {
    res.status(400).json(error.message)
  }
})


module.exports = router;
