require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/servers', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const response = await fetch('https://api.battlemetrics.com/servers?filter[game]=rust&page[size]=100&filter[players][min]=10&filter[countries][]=GB&filter[countries][]=US&filter[countries][]=CA', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});