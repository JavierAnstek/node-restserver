require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
/** Para recibir info de los forms */
const bodyParser = require('body-parser');

/** MIDDLEWARES */
// parse applications/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/** Contenido estatico */
app.use(express.static(path.resolve(__dirname, '../public')));

// Importa las rutas
app.use(require('./routes/index'));

/** Validador de servidor con google Oauth */
app.get('/googlec03814beacb7b1b3.html', (req, res) => {
    res.sendFile('googlec03814beacb7b1b3.html', { root: __dirname });
});

/** CONFIGURACIÓN DB */
/** Conectamos a la DB 'useFindAndModify', false */
opt = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
mongoose.connect(process.env.URLDB, opt, (err, res) => {
    if (err) {
        console.log(`problemas con la conexión: ${process.env.URLDB}`);
        return;
    } else {
        console.log('Base de datos: online');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando por el puerto ${process.env.PORT}`);
});