const express = require('express');
const path = require('path');
const { init } = require('./database');
const logger = require('./log/logger');
const app = express();

app.use(express.static(path.join(__dirname, 'static/')));

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

init(function() {
    logger.info('Starting server listening port 5000');
    app.listen(5000);
})
