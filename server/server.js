require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 300 }); // Cache de 5 minutes

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/servers', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const minPlayers = req.query.minPlayers || 10;
        const countries = req.query.countries ? req.query.countries.split(',') : ['GB', 'US', 'CA'];

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
        cache.set(cacheKey, data); // Mise en cache des résultats
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
