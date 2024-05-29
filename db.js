const mongoose = require('mongoose');

require('dotenv').config();

const url = process.env.DEV_DB_URL;

mongoose.connect(url);
const db = mongoose.connection;

db.on('connected' , () => {
    console.log('Database connected successfully');
})

db.on('disconnected' , () => {
    console.log('Database is disconnected');
})

db.on('error' , (err) => {
    console.log('some error occured',err);
})