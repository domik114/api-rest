const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'tajnyKlucz123';

app.use(bodyParser.json());

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Brak tokena.');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Błąd autentykacji.');
        req.user = user;
        next();
    });
}

app.get('/secure', authenticateToken, (req, res) => {
    res.json({ message: 'Dostęp do zabezpieczonego zasobu udzielony.' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Tutaj powinno odbyć się czy login oraz hasło
    // są prawidłowe np. z bazą danych
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
});

app.get('/public', (req, res) => {
    res.json({ message: 'To jest publiczny zasób.' });
});

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie http://localhost:${port}`);
});
