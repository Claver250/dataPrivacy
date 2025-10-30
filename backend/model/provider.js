const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("../config/database");
const { timeStamp } = require('node:console');

const Provider = sequelize.define('Provider', {
    providerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    providerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING
    },
    manageUrl: {
        type: DataTypes.STRING
    },
});

module.exports = Provider;