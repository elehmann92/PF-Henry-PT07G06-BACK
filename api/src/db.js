require('dotenv').config();
const {Sequelize} = require('sequelize');
const fs = require('fs');
const path = require('path');
const { userInfo } = require('os');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST,DB_PORT } = require('./config');


const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,
    native: false,
    port:DB_PORT
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

 const { Product , Category, User, Cart, Favorites, ShoppingOrder , Transaction, QandA, Reviews, Balance} = sequelize.models;

 //Relaciones entre usuarios y carts 1-1
User.hasOne(Cart, {as:'cartUser', foreignKey:"cartUserId"})
Cart.belongsTo(User, {as: 'cartUser'} )

 //Relaciones entre usuarios y favoritos 1-1
User.hasOne(Favorites, {as:'favoritesUser', foreignKey:"favoritesUserId"})
Favorites.belongsTo(User, {as: 'favoritesUser'} )

//Relaciones entre productos y transacciones 1-1
Product.hasOne(Transaction, {as:'product', foreignKey:"productId"})
Transaction.belongsTo(Product, {as: 'product'} )

//Relaciones entre transaction y shoppingOrder 1-N
ShoppingOrder.hasMany(Transaction, {as: "transactionList", foreignKey: "shoppingOrderId"})
Transaction.belongsTo(ShoppingOrder, {as: "shoppingOrder"})

//Relaciones entre usuarios y productos 1-N
User.hasMany(Product, {as: "productsOwner", foreignKey: "ownerId"})
Product.belongsTo(User, {as: "owner"})

//Relaciones entre usuarios y transacciones 1-N
User.hasMany(Transaction, {as: "buyer", foreignKey: "buyerId"})
Transaction.belongsTo(User, {as: "buyer"})

//Relaciones entre usuarios y shoppingOrder 1-N
User.hasMany(ShoppingOrder, {as: "cart", foreignKey: "cartId"})
ShoppingOrder.belongsTo(User, {as: "cart"})

//Relaciones entre productos y cart N-N
Product.belongsToMany(Cart, {through: "cart_product"})
Cart.belongsToMany(Product, {through: "cart_product"})

//Relaciones entre productos y favorites N-N
Product.belongsToMany(Favorites, {through: "favorites_product"})
Favorites.belongsToMany(Product, {through: "favorites_product"})

 //Relaciones entre productos y categorias N-N
 Product.belongsToMany(Category, {through: "product_category"})
 Category.belongsToMany(Product, {through: "product_category"})

  //Relación de user y reviews 1 a N
  User.hasMany(Reviews, {as: "userReviewed", foreignKey:"userReviewedId"});
  Reviews.belongsTo(User, {as:"userReviewed"});
 
  //Relación de Product y review 1 a 1
  Product.hasOne(Reviews, {as:"productReviewed" ,foreignKey:"productReviewedId"});
  Reviews.belongsTo(Product, {as: "productReviewed"}); 
 
  //Relación de User y QandA 1 a N
  User.hasMany(QandA, {as: "asker", foreignKey:"askerId"});
  QandA.belongsTo(User, {as: "asker"});
 
  //Relación de Product y QAndA 1 a N
  Product.hasMany(QandA, {as: "productQAndA", foreignKey: "productQAndAId"});
  QandA.belongsTo(Product, {as:"productQAndA"});
 
  // //Relación de Transaction y Rating 1 to 1
  // User.hasOne(Rating, {as: "transactionRated", foreignKey:"transactionRatedId"});
  // Rating.belongsTo(User, {as:"transactionRated"});

 module.exports = {
    Product,
    Category,
    User,
    Cart,
    Favorites,
    Transaction,
    ShoppingOrder,
    QandA,
    // Rating,
    Reviews,
    Balance,
    conn: sequelize,
 }