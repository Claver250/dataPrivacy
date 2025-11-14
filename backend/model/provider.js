const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("../config/database");
const User = require('../model/user')
const { timeStamp } = require('node:console');
const { type } = require('node:os');

const Provider = sequelize.define('Provider', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    providerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    providerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    logo: {
        type: DataTypes.STRING
    },
    manageUrl: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timeStamps: true,
});

Provider.belongsTo(User, {foreignKey: 'userId'})

module.exports = Provider;