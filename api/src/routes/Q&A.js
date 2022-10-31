const { Router } = require("express");

const { QandA } = require("../db");

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

  .post("/", async (req, res) => {
    const { question, productQAndAId } = req.body;
    // **Hardcodeado** hasta que incorporemos token
    const askerId = 8;
    try {
        if (!question || !productQAndAId) throw new Error('No question or product id where recieved')

        const newQAndABlock = await QandA.create({
            question,
        })

        console.log(newQAndABlock)
        
        await newQAndABlock.setAsker(askerId);
        await newQAndABlock.setProductQAndA(productQAndAId);

        res.json(newQAndABlock)

    } catch (error) {
        res.status(400).json(error.message)
    }
  });
module.exports = router;
