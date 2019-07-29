const express = require('express');
const db = require('../providers/firebase');

const app = express();

const User = db.ref(`${process.env.FIREBASE_RULES}/users`);

app.post('/register', (req, res) => {
    // res.send('usuário');
});

app.post('/login', (req, res) => {
    // res.send('usuário');
});

module.exports = app;