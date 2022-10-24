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
      MpTransactionId: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    { sequelize, modelName: "shoppingOrder"}
  );
};