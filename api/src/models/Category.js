const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('Category',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
    });
};