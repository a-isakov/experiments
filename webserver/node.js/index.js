const express = require('express')
const app = express();
// const bodyParser = require('body-parser')
// app.use(bodyParser.json());

const path = require('path');

const PORT = 8080;

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});