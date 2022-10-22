const { DataTypes, Model } = require("sequelize");

class ShoppingOrder extends Model {}

module.exports = (sequelize) => {
  return ShoppingOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    { sequelize, modelName: "shoppingOrder"}
  );
};