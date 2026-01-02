const express = require('express');
const responseEnhancer = require('./api/v1/middlewares/responseEnhancer.middleware');

const app = express();

app.use(express.json());
app.use(responseEnhancer);

// Routes
app.use('/api/v1', require('./api/v1/routes'));

module.exports = app;