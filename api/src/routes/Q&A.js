const { Router } = require("express");

const { QandA } = require("../db");
const { getInstanceById } = require("../handlers");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const qA = await QandA.findAll({ order: ["id"] });

      return res.status(200).json(qA);
    } catch (error) {
      return res.status(404).json(error);
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const qAndABlock = await getInstanceById(QandA, id);
      res.json(qAndABlock);
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .post("/", async (req, res) => {
    const { question, productQAndAId } = req.body;
    // **Hardcodeado** hasta que incorporemos token
    const askerId = 8;
    try {
      if (!question || !productQAndAId)
        throw new Error("No question or product id where received");

      const newQAndABlock = await QandA.create({
        question,
      });

      console.log(newQAndABlock);

      await newQAndABlock.setAsker(askerId);
      await newQAndABlock.setProductQAndA(productQAndAId);

      res.json(newQAndABlock);
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .put("/updateAnswer/:id", async (req, res) => {
    const { id } = req.params;
    const { answer } = req.body;
    try {
      if (!answer)
        throw new Error("Update failed. No answer text was received");
      const qAndABlock = await getInstanceById(QandA, id);
      const updated = await qAndABlock.update({ answer });
      res.json(updated);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });
module.exports = router;
