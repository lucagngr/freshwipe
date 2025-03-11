require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 300 }); // Cache de 5 minutes

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Route générale pour tous les serveurs
app.get('/api/servers', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const minPlayers = req.query.minPlayers || 10;
        const countries = req.query.countries ? req.query.countries.split(',') : ['GB', 'US', 'CA', 'FR', 'RU', 'AU', 'DE'
            
        ];

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
        const countries = ['GB', 'US', 'CA',];

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
        const countries = ['GB', 'US', 'CA'];

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
        const countries = ['GB', 'US', 'CA'];

        const cacheKey = `servers_community_${minPlayers}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const url = `https://api.battlemetrics.com/servers?filter[game]=rust&page[size]=100&filter[players][min]=${minPlayers}&${countries.map(c => `filter[countries][]=${c}`).join('&')}&filter[search]=community`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`BattleMetrics API error: ${response.status}`);
        }

        const data = await response.json();
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});