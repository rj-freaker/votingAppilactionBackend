const express = require('express');
require('dotenv').config();
const PORT = process.env.DEV_PORT_NO;

const app = express();
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const bodyParser = require('body-parser');

const db = require('./db');
app.use(bodyParser.json());


app.use('/user', userRoutes);
app.use('/user',candidateRoutes);
app.use('/admin', candidateRoutes);

app.listen(PORT, () => {
    console.log('Server started');
})
