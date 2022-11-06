const { Router } = require("express");

const { Reviews, User, Transaction } = require("../db");
const { getProductById, updateUserRating, throwError } = require("../handlers");
const {getRole} = require('../handlers/routeProtection')

const router = Router();

router
  .get("/",async (req, res) => {
    const {role, id} = req
    try {
      const reviews = await Reviews.findAll({ order: ["id"] });

      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(error.number||400).json(error.message);
    }
  })
  .post("/",getRole, async (req, res) => {
    const { stars, productReviewed } = req.body;
    const reviewer = req.id
    const {role} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const userWithTransactions = await User.findByPk(reviewer, {
        include:{
          model: Transaction,
          as: "buyer"
        }
      })

      const userBoughtProduct = userWithTransactions.toJSON().buyer.some(ele=> ele.productId === productReviewed)

      if (!userBoughtProduct) throwError('Solo puedes publicar una review sobre un producto que hayas comprado', 401)

      const product = await getProductById(productReviewed);
      const owner = product.toJSON().ownerId;
      if (!product || !owner) throwError("Product or owner wasnt found", 404);

      const review = await Reviews.create({
        reviewerId: reviewer,
        stars,
      });

      await review.setProductReviewed(productReviewed);
      await review.setUserReviewed(owner);

      await updateUserRating(owner)

      // **PENDIENTE** -> DESPACHAR MAIL AL OWNER AVISANDO QUE RECIBIÓ UNA REVIEW

      res.json(review);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  });

module.exports = router;
