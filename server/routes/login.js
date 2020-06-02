/** Routers Module users */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });

        if (!userDB)
            return res.status(400).json({ ok: false, msg: '(Usuario) o contraseña incorrectos' });

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({ ok: false, msg: 'Usuario o (contraseña) incorrectos' });
        }

        /**
         * payload: la información que querramos enviar
         * secretKey: llave secreta para decifrar el token
         * expiración: tiempo de vida del token
         */
        let token = jwt.sign({ usuario: userDB }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });
        res.json({ ok: true, usuario: userDB, token });
    });
});

module.exports = app;