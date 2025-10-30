const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Provider = require('../model/provider');
const Consent = require('../model/consent')
const { timeStamp } = require('node:console');

const Connection = sequelize.define('Connection', {
    connectionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    app: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    granted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    scope: {
        type: DataTypes.STRING,
    },
    grantedAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    }
});

Connection.belongsTo(Provider, {foreignKey: 'providerID'});
Connection.belongsTo(Consent, {foreignKey: 'consentID'})

module.exports = Connection;