const { Router } = require("express");
const categories= require("../../categories.json");
const {Category}= require("../db.js");
const router = Router();
  
const getCategoriesData= async ()=>{
    const apiAddress= await categories;
  
    const apiDataMapped= await apiAddress.map(category=>{
        return {
            id: category.id,
            name: category.name,
        }
    })
    return apiDataMapped;
  }
  
  router.get("/", async(req,res)=>{
    try{
        const categoriesData= await getCategoriesData();

        await Category.bulkCreate(categoriesData);

        const allCategories= await Category.findAll();

        return res.status(200).json(allCategories);
    }
    catch(error){
        return res.status(404).json(error);
    }
  })


module.exports = router;