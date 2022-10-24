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
      total: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      paymentReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      payment_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      collector_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      merchant_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    { sequelize, modelName: "shoppingOrder"}
  );
};