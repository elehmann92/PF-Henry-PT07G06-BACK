const data = require('./categories.json');
const dataP = require('./products.json');
const dataU = require('./users.json');
const dataR = require("./reviews.json");
const dataQA= require("./qanda.json");

const {Category, Product, User, Reviews, QandA} = require('../src/db.js')

// funcion para setear los datos iniciales a la tabla Categories
async function createUsers() {
  dataU.users.forEach(async el =>
    { const [entry , created] = await User.findOrCreate({where:{
      name: el.username,
      password: el.password,
      image: el.image,
      emailAddress: el.emailAddress,
      homeAddress: el.homeAddress,
      region: el.region,
      city: el.city,
      phoneNumber: el.phoneNumber,
      lastTransaction: el.lastTransaction
    }})
    if(created) { await entry.createCartUser({total: 0}); await entry.createFavoritesUser() }
})
};

async function createReviews(){
  dataR.reviews.forEach(el=> 
    Reviews.findOrCreate({where:{stars : el.stars}}))
}

async function createQA(){
  dataQA.qanda.forEach(el=>{
    QandA.findOrCreate({where:
      {
        questionary: el.questionary,
        answers:el.answers,
      }
    })
  })
}

async function creatCategories() {
  data.categories.forEach(async el => 
    await Category.findOrCreate({where: {name: el.name}}))
};

async function createProducts() {
  dataP.products.forEach(async el => 
    {const [entry , created] = await Product.findOrCreate({where: {
    name: el.name,
    price: el.price,
    description: el.description,
    condition: el.condition,
    image: el.image,
    ownerId: el.owner,
    status: el.status
    }})
    if(created){
    el.categories.forEach(async el => {id = await Category.findAll({where: {name : el} });
    entry.setCategories(id[0].dataValues.id)
    })}
})};

module.exports = {
    createUsers,
    creatCategories,
    createProducts,
    createReviews,
    createQA,
  };