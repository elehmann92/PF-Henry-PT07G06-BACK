const {DataTypes, Model}= require("sequelize");

class QandA extends Model{}

module.exports= (sequelize)=>{
    return QandA.init({
        id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        questionary:{
            type: DataTypes.ENUM("¿Qué opinas de este producto?","¿Qué crees que se pueda mejorar en el producto?", "¿Recomendarías este vendedor?", "¿Cómo fue la calidad de atención por parte del vendedor?"),
            allowNull:false,
        }
    },
    {
        sequelize, modelName: "QandA", timestamps: false,
    })
}