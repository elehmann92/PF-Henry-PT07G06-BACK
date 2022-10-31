const { Router } = require("express");

const { Reviews } = require("../db");
const { getProductById } = require("../handlers");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const reviews = await Reviews.findAll({ order: ["id"] });

      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(404).json(error);
    }
  })
  .post("/", async (req, res) => {
    const { stars, productReviewed } = req.body;
    // **Hardcodeado** hasta que incorporemos token
    const reviewer = 8;
    try {
      const product = await getProductById(productReviewed);
      const owner = product.toJSON().ownerId;
      if (!product || !owner) throw new Error("Product or owner wasnt found");

      const review = await Reviews.create({
        reviewerId: reviewer,
        stars,
      });

      await review.setProductReviewed(productReviewed);
      await review.setUserReviewed(owner);

      res.json(review);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
