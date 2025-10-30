const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Compliance = require('../model/compliance');
const { toDefaultValue } = require('sequelize/lib/utils');

const Ledger = sequelize.define('Ledger', {
    date: {
        type: DataTypes.DATE,
        toDefaultValue:  DataTypes.NOW,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actor: DataTypes.STRING,
});

Ledger.belongsTo(Compliance, {onDelete : 'CASCADE'});
Compliance.hasMany(Ledger);

module.exports = Ledger;