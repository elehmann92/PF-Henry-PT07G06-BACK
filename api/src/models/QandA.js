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
            type: DataTypes.STRING,
            allowNull:true,
        },
        answers:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue:""
        }
    },
    {
        sequelize, modelName: "QandA", timestamps: false,
    })
}