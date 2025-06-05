require('dotenv').config();
const express = require('express');
const path = require('path');
const NodeCache = require('node-cache');
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const app = express();
const port = 3000;

// Cache global
global.cache = new NodeCache({ stdTTL: 300 });

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Routes
app.use('/api/servers', require('./routes/servers'));
app.use('/api/favorites', require('./routes/favorite'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rating', require('./routes/ratings'));

// Sync & Start
sequelize.sync({ alter: false })
  .then(() => {
    console.log('📦 Base de données synchronisée avec succès.');
    app.listen(port, () => {
      console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de synchronisation :', err);
  });
