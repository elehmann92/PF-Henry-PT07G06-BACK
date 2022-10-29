const {Router}= require("express");

const {QandA}= require("../db");

const router= Router();

router.get("/", async (req,res)=>{
    try{
        const qA= await QandA.findAll({order:["id"]}); 

        return res.status(200).json(qA);
    }
    catch(error){
        return res.status(404).json(error);
    }
})

module.exports= router;