const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Ajouter un serveur aux favoris
router.post('/', async (req, res) => {
  const { userId, serverId } = req.body;

  try {
    const result = await Favorite.create({ userId, serverId });
    res.status(201).json({ message: 'Serveur ajouté aux favoris' });
  } catch (err) {
    console.error('❌ ERREUR favori :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Récupérer les favoris d’un utilisateur
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.findAll({ where: { userId } });
    res.json(favorites);
  } catch (err) {
    console.error('Erreur récupération favoris :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Supprimer un favori
router.delete('/', async (req, res) => {
  const { userId, serverId } = req.body;

  try {
    const deleted = await Favorite.destroy({
      where: { userId, serverId }
    });

    if (deleted) {
      res.status(200).json({ message: 'Favori supprimé' });
    } else {
      res.status(404).json({ message: 'Favori introuvable' });
    }
  } catch (err) {
    console.error('Erreur suppression favori :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
