const server = require('./src/app.js')
const {conn} = require('./src/db.js')

//server.listen(3001, ()=>{console.log('%s listening at 3001')})

// una vez que tengamos la base de datos, habría que hacer un sync y el listening mostrarlo luego del then. Así:
// // Syncing all the models at once.
 conn.sync({ alter: true }).then(() => {
     server.listen(3001, () => {
       console.log('%s listening at 3001'); // eslint-disable-line no-console
     });
});
  