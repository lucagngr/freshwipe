require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 300 }); // Cache de 5 minutes
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const User = require('./models/User');
const path = require('path'); // Ajout de l'importation de path

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // Ajout du middleware pour parser le JSON

// Route générale pour tous les serveurs
app.get('/api/servers', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const minPlayers = req.query.minPlayers || 10;
        const countries = req.query.countries ? req.query.countries.split(',') : ['GB', 'US', 'CA', 'FR', 'RU', 'AU', 'DE'];

        const cacheKey = `servers_${minPlayers}_${countries.join(',')}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const url = `https://api.battlemetrics.com/servers?filter[game]=rust&page[size]=100&filter[players][min]=${minPlayers}&${countries.map(c => `filter[countries][]=${c}`).join('&')}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`BattleMetrics API error: ${response.status}`);
        }

        const data = await response.json();
        data.data.sort((a, b) => b.attributes.players - a.attributes.players);
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// Route pour les serveurs officiels
app.get('/api/servers/official', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const minPlayers = req.query.minPlayers || 10;
        const countries = ['GB', 'US', 'CA', 'FR', 'RU', 'AU', 'DE'];

        const cacheKey = `servers_official_${minPlayers}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const url = `https://api.battlemetrics.com/servers?filter[game]=rust&page[size]=100&filter[players][min]=${minPlayers}&${countries.map(c => `filter[countries][]=${c}`).join('&')}&filter[search]=official`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`BattleMetrics API error: ${response.status}`);
        }

        const data = await response.json();
        data.data.sort((a, b) => b.attributes.players - a.attributes.players);
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// Route pour les serveurs moddés
app.get('/api/servers/modded', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const minPlayers = req.query.minPlayers || 10;
        const countries = ['GB', 'US', 'CA', 'FR', 'RU', 'AU', 'DE'];

        const cacheKey = `servers_modded_${minPlayers}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const url = `https://api.battlemetrics.com/servers?filter[game]=rust&page[size]=100&filter[players][min]=${minPlayers}&${countries.map(c => `filter[countries][]=${c}`).join('&')}&filter[search]=modded`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`BattleMetrics API error: ${response.status}`);
        }

        const data = await response.json();
        data.data.sort((a, b) => b.attributes.players - a.attributes.players);
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// Route pour les serveurs communautaires
app.get('/api/servers/community', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const minPlayers = req.query.minPlayers || 10;
        const cacheKey = `servers_community_${minPlayers}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) return res.json(cachedData);

        const url = `https://api.battlemetrics.com/servers?filter[game]=rust&page[size]=100&filter[players][min]=${minPlayers}&filter[search]=community`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`BattleMetrics API error: ${response.status}`);
        }

        const data = await response.json();
        data.data = data.data.filter(server => server.attributes.details?.rust_type === 'community');
        data.data.sort((a, b) => b.attributes.players - a.attributes.players);
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// Route pour les Utilisateurs
app.post('/api/register', async (req, res) => {
    try {
        console.log('Tentative d\'inscription:', req.body); // Log pour debugging
        
        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            username,
            password: hashedPassword,
            email
        });

        console.log('Inscription réussie pour:', username); // Log pour debugging
        res.status(201).json({ message: 'Inscription réussie', user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        res.json({ message: 'Connexion réussie' });
    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});