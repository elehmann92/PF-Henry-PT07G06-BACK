const data = require('./categories.json')
const dataP = require('./products.json')
const dataU = require('./users.json')
const dataB = require('./initialBalance.json')
const {Category, Product, User, Balance} = require('../src/db.js')

// funcion para setear los datos iniciales a la tabla Categories
async function createUsers() {
  dataU.users.forEach(async el =>
    {
      const [entry, created] = await User.findOrCreate({
        where: {
          emailAddress: el.emailAddress,
        },
        defaults: {
          name: el.username,
          image: el.image,
          homeAddress: el.homeAddress,
          region: el.region,
          city: el.city,
          phoneNumber: el.phoneNumber,
          lastTransaction: el.lastTransaction,
          status: el.status,
          isAdmin: el.isAdmin,
        },
      });
      if (created) {
        await entry.createCartUser({ total: 0 });
        await entry.createFavoritesUser();
      }
    })
};


async function creatCategories() {
  data.categories.forEach(async el => 
    await Category.findOrCreate({where: {name: el.name}}))
};

async function createProducts() {
  dataP.products.forEach(async el => 
    {const [entry , created] = await Product.findOrCreate({where: {
      name: el.name,
    }, defaults: {
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

async function initialBalance() {
  Balance.create(dataB)
}

module.exports = {
    createUsers,
    creatCategories,
    createProducts,
    initialBalance
  };