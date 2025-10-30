const {Sequelize, DataTypes, UUIDV4} = require('sequelize');
const sequelize = require("../config/database");
const { timeStamp } = require('node:console');

const User =sequelize.define ('User', {
    userID : {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Joe Doe'
    },
    
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Janedoe@gmail.com',
        unique : true
    },
    password : {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'user'
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
{
    timeStamps: true,
});

module.exports = User;