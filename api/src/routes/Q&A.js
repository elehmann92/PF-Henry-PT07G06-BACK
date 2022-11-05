const { Router } = require("express");

const { QandA, Product } = require("../db");
const { getInstanceById, throwError } = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const qA = await QandA.findAll({ order: ["id"] , include:{
        model: Product,
        as: "productQAndA"
      }});

      return res.status(200).json(qA);
    } catch (error) {
      return res.status(404).json(error.message);
    }
  })

  .get("/byToken",getRole, async (req,res) => {
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const qAndAs = await QandA.findAll({include:{
        model: Product,
        as: "productQAndA"
      }})

      const asAsker = qAndAs.filter(ele => ele.askerId === id);
      const asOwner = qAndAs.filter(ele => ele.productQAndA?.ownerId === id);
    
      res.json({
        userQAndAs: {
          asAsker,
          asOwner,
        },
      });
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const qAndABlock = await QandA.findByPk(id, {
        include: {
          model: Product,
          as: "productQAndA",
        },
      });
      res.json(qAndABlock);
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .post("/", getRole,async (req, res) => {
    const { question, productQAndAId } = req.body;
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      if (!question || !productQAndAId) throwError("No question or product id where received", 400);

      const newQAndABlock = await QandA.create({
        question,
      });

      await newQAndABlock.setAsker(id);
      await newQAndABlock.setProductQAndA(productQAndAId);

      // **PENDIENTE** -> DESPACHAR MAIL AL OWNER AVISANDO QUE LE PREGUNTARON

      res.json(newQAndABlock);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .put("/updateAnswer/:qAndABlockId", getRole,async (req, res) => {
    const { qAndABlockId } = req.params;
    const { answer } = req.body;
    const {role, id} = req
    try {
      if (role === "guest") throwError("You are not signed in", 401);
      if (!answer) throwError("Update failed. No answer text was received", 400);
      const qAndABlock = await QandA.findByPk(qAndABlockId, {
        include: { model: Product, as: "productQAndA" },
      });
      if (role === 'user' && parseInt(id) !== qAndABlock.toJSON()?.productQAndA?.ownerId)
        throwError(
          "You can not update answers to questions which you do not own",
          401
        );
      const updated = await qAndABlock.update({ answer });
      // **PENDIENTE** -> DESPACHAR MAIL AL ASKER AVISANDO QUE LE CONTESTARON
      res.json(updated);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  });
module.exports = router;
