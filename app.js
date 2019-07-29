const express = require('express');
const path = require('path');
const app = express();

//Dando acesso aos arquivos estáticos
app.use('/views', express.static('views'));

// ===== VIEWS ===== //
const getViewPath = (view) => {
    return path.join(__dirname, `./views/${view}/${view}.html`);
}
// app.get('/', (req, res) => {
//     res.sendfile(path.join(__dirname, './views/home/home.html'));
// });
app.get('/', (req, res) => {
    res.sendfile(getViewPath('home'));
});
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
// ================= //

app.listen(3000, () => {
    console.log('READY');
});