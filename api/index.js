const server = require('./src/app.js')
const {conn , Category, Product, User} = require('./src/db.js')
const data = require('./categories.json')
const dataP = require('./products.json')
const dataU = require('./users.json')

// funcion para setear los datos iniciales a la tabla Categories
async function createUsers() {
  dataU.users.forEach(el =>
    User.findOrCreate({where:{
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
    )

}


async function creatCategories() {
  data.categories.forEach(el => 
    Category.findOrCreate({where: {name: el.name}}))
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

// // Syncing all the models at once.
 conn.sync({ alter: true }).then(() => {
     server.listen(3001, () => {
       console.log('Server listening at 3001'); // eslint-disable-line no-console
     });
})
.then(() => createUsers())
.then(() => creatCategories())
.then(() => createProducts());
  