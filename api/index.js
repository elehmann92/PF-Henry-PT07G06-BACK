const server = require('./src/app.js')
const {conn , Category} = require('./src/db.js')
const data = require('./categories.json')

// funcion para setear los datos iniciales a la tabla Categories
async function creatTypes() {
  let categoriesDb = await Category.findAll()
  if(categoriesDb.length===0) {
       data.categories.forEach(el => Category.create({id: el.id, name: el.name}))
  }
}

//server.listen(3001, ()=>{console.log('%s listening at 3001')})

// una vez que tengamos la base de datos, habría que hacer un sync y el listening mostrarlo luego del then. Así:
// // Syncing all the models at once.
 conn.sync({ alter: true }).then(() => {
     server.listen(3001, () => {
       console.log('%s listening at 3001'); // eslint-disable-line no-console
     });
})
.then(() => creatTypes());
  