const { Router } = require("express");
const {
  getFavoritesDb,
  getFavoritesById,
  findFavoritesAndProduct,
} = require("../handlers");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const favoritesDb = await getFavoritesDb();
      res.json(favoritesDb);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const singleFavList = await getFavoritesById(id);
      res.json(singleFavList);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .put("/addProductToFavList/:favListId/:productId", async (req, res) => {
    const { favListId, productId } = req.params;
    try {
      const { favListToAddTo , productToAdd} = await findFavoritesAndProduct(
        favListId,
        productId
      );

      const exists = await favListToAddTo.hasProducts(productToAdd)
      if (exists) throw new Error('Product already exists in fav list')
      
      await favListToAddTo.addProduct(productId);
      res.json("Successfully added");
    } catch (error) {
      res.status(400).json(error.message);
    }
  })
  
  .delete("/removeProductFromFavList/:favListId/:productId",
  async (req, res) => {
    const { favListId, productId } = req.params;
    try {
      const { favListToAddTo , productToAdd} = await findFavoritesAndProduct(
        favListId,
        productId
        );

        const exists = await favListToAddTo.hasProducts(productToAdd)
        if (!exists) throw new Error('Product wasn`t found in fav list')
        
        await favListToAddTo.removeProduct(productId);
        res.json("Successfully removed");
      } catch (error) {
        res.status(400).json(error.message);
      }
    }
  )

  .delete("/clearFavList/:favListId", async (req, res) => {
    const { favListId } = req.params;
    try {
      const favListToClear = await getFavoritesById(favListId);
      await favListToClear.setProducts([]);
      res.json(`Fav List ${favListId} successfully cleared`);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
