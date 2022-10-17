const server = require('./src/app.js')
const {conn , Category, Product} = require('./src/db.js')
const data = require('./categories.json')
const dataP = require('./products.json')

// funcion para setear los datos iniciales a la tabla Categories
async function creatTypes() {
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
    owner: el.owner,
    status: el.status
    }})
    if(created){
    el.categories.forEach(async el => {id = await Category.findAll({where: {name : el} });
    entry.setCategories(id[0].dataValues.id)
    })}
})};

//server.listen(3001, ()=>{console.log('%s listening at 3001')})

// una vez que tengamos la base de datos, habría que hacer un sync y el listening mostrarlo luego del then. Así:
// // Syncing all the models at once.
 conn.sync({ alter: true }).then(() => {
     server.listen(3001, () => {
       console.log('Server listening at 3001'); // eslint-disable-line no-console
     });
})
.then(() => creatTypes())
.then(() => createProducts());
  