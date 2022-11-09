const server = require('./src/app.js')
const {PORT}= require('./src/config')

const {conn} = require('./src/db.js')
const {createUsers, creatCategories, createProducts, initialBalance} = require('./dbSetup/idex')
// // Syncing all the models at once.

 conn.sync({ force: true }).then(() => {
     server.listen(PORT, () => {
       console.log('Server listening'); // eslint-disable-line no-console
     });
})
.then(() => createUsers())
.then(() => creatCategories())
.then(() => createProducts())
.then(() => initialBalance());
  