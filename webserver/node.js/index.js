const express = require('express')
const app = express();

// const bodyParser = require('body-parser')
// app.use(bodyParser.json());

const path = require('path');

const PORT = 8080;

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/api/v1/get-random-array', async (req, res) => {
    const max_random = req.query.max || 1000;
    const array_items_count = req.query.count || 10;

    res_arr = [];
    for(i = 0; i < array_items_count; i++) {
        res_arr[i] = Math.round(Math.random() * max_random);
    }
    res.contentType('application/json');
    res.json({array: res_arr});
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});