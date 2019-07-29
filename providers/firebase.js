const firebase = require('firebase')

firebase.initializeApp({
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "zappy-54d5e.firebaseapp.com",
    databaseURL: "https://zappy-54d5e.firebaseio.com",
    projectId: "zappy-54d5e",
    storageBucket: "",
    messagingSenderId: "298567232541",
    appId: "1:298567232541:web:54341f296afd99e0"
});

module.exports = firebase.database();