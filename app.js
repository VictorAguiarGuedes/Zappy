const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./providers/firebase');
const handleError = require('./providers/handle-error');

const app = express();

//Dando acesso aos arquivos estáticos
app.use('/views', express.static('views'));

dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var sess = {
    secret: process.env.SESSION_TOKEN,
    cookie: {}
}

app.use(session(sess))

// ===== ROUTES ===== //
//Redireciona o fluxo para o user.js
app.use('/api/user', require('./routes/user'))
// ================= //

// ROTAS QUE NÃO PRECISAM DE AUTENTICAÇÃO //
const getViewPath = (view) => {
    return path.join(__dirname, `./views/${view}/${view}.html`);
}
// app.get('/login', (req, res) => {
//     res.sendfile(getViewPath('login'));
// });
// app.get('/register', (req, res) => {
//     res.sendfile(getViewPath('register'));
// });
app.get('/:view', (req,res) => {
    res.sendFile(getViewPath(req.params.view), (err) => {
        if (err) res.send('404');
    })
})
// ========= //

//Fluxo a partir daqui bloqueado, se não estiver autenticado
app.use((req, res, next) => {
    if(!req.session.userId) {
        if(req.url.indexOf('api') !== -1) {
            handleError(res, null, 'unauthenticated');
            return;
        }
        res.redirect('/login');
        return;
    }
    next();
});

app.use('/api/message', require('./routes/message'))

// ===== VIEWS ===== //

app.get('/', (req, res) => {
    console.log(req.session.userId);
    res.sendfile(getViewPath('home'));
});

// ================= //

app.listen(3000, () => {
    console.log('READY');
});