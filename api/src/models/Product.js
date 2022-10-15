const { DataTypes, condition } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('product',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        condition:{
            type:DataTypes.STRING,
        },
        image:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        owner:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        status:{
            type: DataTypes.STRING,
        }
    },{timestamps: false});
};