const { Router } = require("express");
const category = require('../../categories.json')
const {Category} = require('../db')

const router = Router();

async function creatTypes() {
    const categoriesDb = await Category.findAll()
    if(categoriesDb.length===0) {
         category.categories.map(el => Category.create({id: el.id, name: el.name}))
    }
}

// Guarda inicialmente las categorias en la base de datos
creatTypes()

  
module.exports = router;