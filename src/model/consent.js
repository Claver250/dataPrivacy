const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("../config/database");
const User = require('../model/user');
const Connection = require('../model/connection')
const { timeStamp } = require('node:console');

const Consent =sequelize.define ('Consent', {
    consentID : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    consentType : {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Joe Doe'
    },
    granted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status : {
        type: DataTypes.ENUM('Revoke Access', 'Grant Access'),
        allowNull: false,
        defaultValue: 'GRANT ACCESS',
    },
},
{
    timeStamps: true,
});

User.hasMany(Consent, {foreignKey: 'userID'});
Consent.belongsTo(User, {foreignKey: 'userID'});
Consent.hasOne(Connection, {foreignKey: 'connectionID'})

module.exports = Consent;