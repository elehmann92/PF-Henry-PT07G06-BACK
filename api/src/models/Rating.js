const { DataTypes, Model } = require("sequelize");

class Rating extends Model {}

module.exports = (sequelize) => {
  return Rating.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ratingAverage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "rating",
      timestamps: false,
    }
  );
};
