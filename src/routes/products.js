const { Router } = require("express");
const {Product}= require("../db.js");
const {Category}= require("../db.js");
const products= require("../../products.json");
const router = Router();

const getProductsData= async ()=>{

  const apiInfo= await products;

  const apiMapping= await apiInfo.map(product=>{
    return{
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      condition: product.condition,
      image: product.image,
      owner: product.owner,
      status: product.status
    }
  })
  return apiMapping;
}



router.get("/", async (req, res) => {
  try{
    const productsData= await getProductsData();

   await Product.bulkCreate(productsData);

    const allProducts= await Product.findAll({include:[Category]});

    return res.status(201).json(allProducts);
  }
  catch(error){
    return res.status(404).json(error);
  }
});

module.exports = router;
