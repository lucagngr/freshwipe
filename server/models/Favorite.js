const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Favorite = sequelize.define('Favorite', {
  serverId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

module.exports = Favorite;