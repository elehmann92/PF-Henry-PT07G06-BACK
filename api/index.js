const server = require('./src/app.js')
const {conn , Category, Product} = require('./src/db.js')
const data = require('./categories.json')
const dataP = require('./products.json')

// funcion para setear los datos iniciales a la tabla Categories
async function creatTypes() {
  let categoriesDb = await Category.findAll()
  if(categoriesDb.length===0) {
       data.categories.forEach(el => Category.create({id: el.id, name: el.name}))
  }
}

async function createProducts() {
  let productsDb = await Product.findAll()
  if(productsDb.length===0) {
    dataP.products.forEach(async el => {const newP = await Product.create({
      id: el.id,
      name: el.name,
      price: el.price,
      description: el.description,
      condition: el.condition,
      image: el.image,
      owner: el.owner,
      status: el.status
    })
    el.categories.forEach(async el => {id = await Category.findAll({where: {name : el} });
    newP.setCategories(id[0].dataValues.id)
    })
})}};

//server.listen(3001, ()=>{console.log('%s listening at 3001')})

// una vez que tengamos la base de datos, habría que hacer un sync y el listening mostrarlo luego del then. Así:
// // Syncing all the models at once.
 conn.sync({ force: false }).then(() => {
     server.listen(3001, () => {
       console.log('Server listening at 3001'); // eslint-disable-line no-console
     });
})
.then(() => creatTypes())
.then(() => createProducts());
  