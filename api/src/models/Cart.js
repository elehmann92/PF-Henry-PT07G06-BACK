const { DataTypes, Model } = require("sequelize");

class Cart extends Model {}

module.exports = (sequelize) => {
  return Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    },
    { sequelize, modelName: "cart", timestamps: false }
  );
};
