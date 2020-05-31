require('./config/config');
const express = require('express');
const app = express();

/** Para recibir info de los forms */
const bodyParser = require('body-parser');

/** MIDDLEWARES */
// parse applications/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


/** Routers Module users */
app.get('/usuario', (req, res) => {
    res.json('Hola mundo');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({ ok: false, msg: 'Paseme el hpta nombre' });
    } else {
        res.json({ msg: 'Hola en Post', persona: body });
    }
});

app.put('/usuario/:id', (req, res) => {
    res.json(`Hola en put ${req.params.id}`);
});

app.delete('/usuario/:id', (req, res) => {
    res.json(`Hola en delete ${req.params.id}`);
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando por el puerto ${process.env.PORT}`);
})