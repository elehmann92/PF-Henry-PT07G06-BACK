const { Router } = require("express");
const { Category } = require("../db");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const categories = await Category.findAll({ order: ["id"] });
      res.json(categories);
    } catch (error) {
      res.status(404).json(null);
    }
  })

  .get("/names", async (req, res) => {
    try {
        const categoryNames = await Category.findAll();
        res.json(categoryNames.map(categoryObject => categoryObject.name))
    } catch (error) {
        res.status(404).json(null)
    }
  });

module.exports = router;
