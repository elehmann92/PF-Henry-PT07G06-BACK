const server = require('./src/app.js')
const {conn} = require('./src/db.js')
const {createUsers, creatCategories, createProducts} = require('./dbSetup/idex')

// // Syncing all the models at once.
 conn.sync({ force: true }).then(() => {
     server.listen(3001, () => {
       console.log('Server listening at 3001'); // eslint-disable-line no-console
     });
})
.then(() => createUsers())
.then(() => creatCategories())
.then(() => createProducts());
  