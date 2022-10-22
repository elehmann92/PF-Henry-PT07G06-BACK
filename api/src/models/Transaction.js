const { DataTypes, Model } = require("sequelize");

class Transaction extends Model {}

module.exports = (sequelize) => {
  return Transaction.init(
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
    { sequelize, modelName: "transaction"}
  );
};