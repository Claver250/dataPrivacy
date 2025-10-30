const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Compliance = sequelize.define('Compliance', {
    type: {
        type: DataTypes.ENUM('Incident', 'UserRequest', 'Policy'),
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: DataTypes.TEXT,

    severity: DataTypes.ENUM('LOw', 'Medium', 'High'),

    user: DataTypes.STRING,
    
    status: {
        type: DataTypes.ENUM('Open', 'Pending', 'Closed', 'Completed'),
        defaultValue: 'Pending',
    },
    reportedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    resolution: DataTypes.STRING,
});

module.exports = Compliance;