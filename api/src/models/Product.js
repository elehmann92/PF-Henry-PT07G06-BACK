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
            type:DataTypes.ENUM("Como nuevo", "Usado", "Claros signos de uso"),
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
            type: DataTypes.ENUM("Publicado", "En pausa", "Eliminado", "Vendido"),
        }
    },{timestamps: false});
};