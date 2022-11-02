const { DataTypes, Model } = require("sequelize");

class Reviews extends Model {}

module.exports = (sequelize) => {
  return Reviews.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
      },
      reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "reviews",
      timestamps: false,
    }
  );
};
