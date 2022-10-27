const { DataTypes, Model } = require("sequelize");

class Favorites extends Model {}

module.exports = (sequelize) => {
  return Favorites.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    },
    { sequelize, modelName: "favorites", timestamps: false }
  );
};