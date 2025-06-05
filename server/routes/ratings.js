const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// POST /api/rating : Enregistrer ou mettre à jour une note
router.post('/', async (req, res) => {
  const { userId, serverId, value } = req.body;

  if (!userId || !serverId || value === undefined) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    const [note, created] = await Note.upsert({ userId, serverId, rating: value });
    res.status(200).json({ message: created ? 'Note créée' : 'Note mise à jour' });
  } catch (err) {
    console.error('Erreur enregistrement note :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/rating/:serverId : Moyenne des notes
router.get('/:serverId', async (req, res) => {
  const { serverId } = req.params;

  try {
    const notes = await Note.findAll({ where: { serverId } });

    if (!notes.length) {
      return res.json({ average: null, count: 0 });
    }

    const total = notes.reduce((sum, n) => sum + n.rating, 0);
    const average = total / notes.length;

    res.json({ average: average.toFixed(1), count: notes.length });
  } catch (err) {
    console.error('Erreur récupération moyenne :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
