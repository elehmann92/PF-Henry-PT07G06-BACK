const { Router } = require("express");
const { Cart, Product } = require("../db");
const { getCartsDb, getCartById, findCartAndProduct } = require("../handlers");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const cartsDb = await getCartsDb();
      res.json(cartsDb);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const singleCart = await getCartById(id);
      res.json(singleCart);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .put("/addProductToCart/:cartId/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    try {
      const { cartToAddTo, productToAdd } = await findCartAndProduct(cartId, productId);

      if (productToAdd.toJSON()?.status !== "Publicado") throw new Error('Selected product is not available for purchasing at the moment')

      const exists = await cartToAddTo.hasProducts(productToAdd)
      if (exists) throw new Error('Product already exists in cart')

      await cartToAddTo.addProduct(productId);
      const price = productToAdd.toJSON().price
      await cartToAddTo.update({total:  cartToAddTo.toJSON().total + price});
      res.json("Successfully added");
    } catch (error) {
      res.status(400).json(error.message);
    }
  })
  
  .delete("/removeProductFromCart/:cartId/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    try {
      const { cartToAddTo , productToAdd} = await findCartAndProduct(cartId, productId);
      
      const exists = await cartToAddTo.hasProducts(productToAdd)
      if (!exists) throw new Error('Product wasn`t found in cart')
      
      await cartToAddTo.removeProduct(productId);
      const price = productToAdd.toJSON().price
      await cartToAddTo.update({total:  cartToAddTo.toJSON().total - price})
      res.json("Successfully removed");
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .delete("/clearCart/:cartId", async (req, res) => {
    const { cartId } = req.params;
    try {
      const cartToClear = await getCartById(cartId);
      await cartToClear.setProducts([]);
      res.json(`Cart ${cartId} successfully cleared`);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
