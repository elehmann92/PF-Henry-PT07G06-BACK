const { DataTypes, Model } = require("sequelize");

class Category extends Model {}

module.exports = (sequelize) => {
  return Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "category", timestamps: false }
  );
};
