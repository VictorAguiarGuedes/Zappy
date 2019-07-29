const express = require('express');

const db = require('../providers/firebase');
const handleError = require('../providers/handle-error');

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

app.post('/login', (req, res) => {
    // res.send('usuário');
});

module.exports = app;