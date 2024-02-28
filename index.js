const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/despre', (req, res) => {
    res.render('despre');
});

app.get('/alegeri', (req, res) => {
    res.render('alegeri');
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});