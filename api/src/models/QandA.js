const { DataTypes, Model } = require("sequelize");

class QandA extends Model {}

module.exports = (sequelize) => {
  return QandA.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "QandA",
      timestamps: false,
    }
  );
};
