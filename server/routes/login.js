/** Routers Module users */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.ID_CLIENT_GOOGLE);

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

/** Configuraciones Auth con google */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.ID_CLIENT_GOOGLE
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

/** Autentica con userAuth */
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch((e) => {
        return res.status(403).json({ ok: false, err: e });
    });

    /** Valida existencia del usuario */
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });

        if (userDB) { // si existe user en DB
            if (userDB.google === false) { // si se registró con cuenta normal
                return res.status(400).json({ ok: false, err: { message: 'Debe de usar su autenticación normal' } });
            } else { // si se autentico con GoogleAuth
                let token = jwt.sign({ usuario: userDB }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });
                res.json({ ok: true, usuario: userDB, token });
            }
        } else { // Si no existe en la DB
            let usuario = new User();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, userDB) => {
                if (err)
                    return res.status(500).json({ ok: false, msg: err.message });

                /** Retorna el token */
                let token = jwt.sign({ usuario: userDB }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });
                res.json({ ok: true, usuario: userDB, token });
            });
        }
    });
});

module.exports = app;