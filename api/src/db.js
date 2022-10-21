require('dotenv').config();
const {Sequelize} = require('sequelize');
const fs = require('fs');
const path = require('path');
const { userInfo } = require('os');
const {
    DB_USER, DB_PASSWORD, DB_HOST
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/juira`, {
    logging: false,
    native: false,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !==0) && (file !==basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)))
  });

 modelDefiners.forEach(model => model(sequelize));
 
 let entries = Object.entries(sequelize.models);
 let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase()+entry[0].slice(1), entry[1]]);
 sequelize.models = Object.fromEntries(capsEntries);

 const { Product , Category, User, Cart} = sequelize.models;

 //Relaciones entre usuarios y carts
 User.hasOne(Cart, {as:'cartUser', foreignKey:"cartUserId"})
 Cart.belongsTo(User, {as: 'cartUser'} )

 //Relaciones entre usuarios y productos
User.hasMany(Product, {as: "productsOwner", foreignKey: "ownerId"})
Product.belongsTo(User, {as: "owner"})

//Relaciones entre productos y cart
Product.belongsToMany(Cart, {through: "cart_product"})
Cart.belongsToMany(Product, {through: "cart_product"})

 //Relaciones entre productos y categorias
 Product.belongsToMany(Category, {through: "product_category"})
 Category.belongsToMany(Product, {through: "product_category"})

 module.exports = {
    Product,
    Category,
    User,
    Cart,
    conn: sequelize,
 }