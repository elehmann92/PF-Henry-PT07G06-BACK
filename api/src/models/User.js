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
                allowNull: false,
            },
            password:{
                type: DataTypes.STRING,
                allowNull: false,
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
                allowNull:false,
            },
            city:{
                type:DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber:{
                type:DataTypes.STRING,
                allowNull: false,
            },
            lastTransaction:{
                type: DataTypes.STRING,
                allowNull:true,
            },
            status:{
                type: DataTypes.STRING,
                allowNull:false,
            },
            isAdmin:{
                type: DataTypes.BOOLEAN,
                allowNull:false,
            },
        },{ sequelize, modelName: "user", timestamps: false }
        )
    }
