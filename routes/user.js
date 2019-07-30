const express = require('express');

const db = require('../providers/firebase');
const handleError = require('../providers/handle-error');
const bcrypt = require('bcrypt');

const app = express();
const User = db.ref(`${process.env.FIREBASE_RULES}/users`);

app.post('/register', async (req, res) => {
    try {
        //Validando dados ausentes
        if(
        !req.body.username 
        || !req.body.password 
        || !req.body.password2 
        || !req.body.alias){
            handleError(res, null, 'missing-data');
            return;
        }
    
        //Validando se já existe um usuário cadastrado
        const checkUser = 
            (await User
                .orderByChild('username')
                .equalTo(req.body.username)
                .once('value')).val();
    
        if(checkUser) {
            handleError(res, null, 'user-already-exists');
            return;
        }
    
        if(req.body.password !== req.body.password2) {
            handleError(res, null, 'passwords-dont-match');
            return;
        }
    
        //bcrypt não descriptografa, apenas compara o criptografado com o dado
        //e informa se um foi originado a partir do outro
        const hash = await bcrypt.hash(req.body.password, 10);
    
        await User.push({
            username: req.body.username,
            password: hash,
            alias: req.body.alias
        });
        res.send('ok')
    } catch (error) {
        handleError(res, error, null);
    }
});

app.post('/login', async (req, res) => {
    try {
        //Validando dados ausentes
        if(!req.body.username || !req.body.password){
            handleError(res, null, 'missing-data');
            return;
        }
        const user = 
            (await User
                .orderByChild('username')
                .equalTo(req.body.username)
                .once('value')).val();
    
        if(!user) {
            handleError(res, null, 'user-not-found');
            return;
        }

        const [ userId, userData ] = Object.entries(user)[0];

        const match = await bcrypt.compare(req.body.password, userData.password);
        if(match) {
            req.session.userId = userId;
            res.send('ok');
            return;
        }
        handleError(res, null, 'wrong-password');
    } catch (error) {
        handleError(res, error, null);
    }
});

// CONTACT

app.post('/contact/:contact', async (req, res) => {
    try {
        const user = 
            (await User
                .orderByChild('username')
                .equalTo(req.params.contact)
                .once('value')).val();
    
        if(!user) {
            handleError(res, null, 'user-not-found');
            return;
        }
    
        const [contactId, contactData] = Object.entries(user)[0];
    
        await User.child(req.session.userId).child('contacts').push({
            alias: contactData.alias,
            id: contactId
        })

        res.send('ok');
    } catch (error) {
        handleError(res, error, null);
    }
});

app.get('/contact', async (req, res) => {
    try {
        const contactsFirebase = await User.child(req.session.userId).child('contacts').once('value');
        const contacts = [];
        contactsFirebase.forEach((contact) => {
            contacts.push(contact.val());
        });
        if(req.query.length) {
            res.send(''+contacts.length);
            return;
        }
        res.send(contacts);
    } catch (error) {
        handleError(res, error, null);
    }
});

module.exports = app;