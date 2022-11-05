const { DataTypes, Model } = require("sequelize");

class Balance extends Model {}

module.exports = (sequelize) => {
  return Balance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    { sequelize, modelName: "balance", timestamps: false }
  );
};