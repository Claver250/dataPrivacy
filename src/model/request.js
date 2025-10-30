const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("../config/database");
const { timeStamp } = require('node:console');

const Request =sequelize.define ('Request', {
    requestID : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        unique : true,
    },
    app:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    requestType: {
        type: DataTypes.ENUM('Data Access', 'Data Deletion', 'Data Correction'),
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'Provide additional details if needed'
    },
    status:{
        type: DataTypes.TEXT,
        defaultValue: 'PENDING'
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},
{
    timeStamps: true,
});

Request.belongsTo(User, {foreignKey: 'userId'});

module.exports = Request;