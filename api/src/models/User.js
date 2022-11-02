const {DataTypes, Model}= require("sequelize");

class User extends Model{}

    module.exports = (sequelize) =>{
        return User.init({
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement:true,
            },
            name:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            image:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            emailAddress:{
                type: DataTypes.STRING,
                allowNull:false,
            },
            homeAddress:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            region:{
                type: DataTypes.STRING,
                allowNull:true,
            },
            city:{
                type:DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber:{
                type:DataTypes.STRING,
                allowNull: true,
            },
            lastTransaction:{
                type: DataTypes.STRING,
                allowNull:true,
            },
            status:{
                type: DataTypes.STRING,
                allowNull:true,
            },
            isAdmin:{
                type: DataTypes.BOOLEAN,
                allowNull:true,
            },
            rating: {
                type: DataTypes.REAL,
                allowNull: true
            }
        },{ sequelize, modelName: "user", timestamps: false }
        )
    }
