const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Utilisation de la connexion existante

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

module.exports = User;
