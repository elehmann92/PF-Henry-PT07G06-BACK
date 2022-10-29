const {Router}= require("express");

const {Reviews}= require("../db");

const router= Router();

router.get("/", async (req,res)=>{
    try{
        const reviews= await Reviews.findAll({order:["id"]});

        return res.status(200).json(reviews);
    }
    catch(error){
        return res.status(404).json(error);
    }
})

module.exports= router;