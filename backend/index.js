const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();

app.use(express.static(path.join(__dirname, 'static/')));
app.get('/status', async(req, res, next) => {
    let result = {status: 'Success'};
    try {
        await db.test();
    }
    catch(e) {
        result = {
            status: 'Failed',
            error: e.message
        }
    }
    res.json(result);
});

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.listen(5000);
