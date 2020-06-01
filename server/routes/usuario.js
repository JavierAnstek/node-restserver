/** Routers Module users */
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/usuario');
const app = express();

/** Index */
app.get('/usuario', (req, res) => {

    res.json({ ok: true, db: `${process.env.URLDB}` });

    // let desde = req.query.desde || 0;
    // let limite = req.query.limite || 5;

    // desde = Number(desde);
    // limite = Number(limite);

    // /** Filtros */
    // let filter = { estado: true };
    // /** Retorna todos los datos */
    // User.find(filter, 'nombre email role estado google img')
    //     .skip(desde) // salta a los siguientes 5 registros
    //     .limit(limite) // presenta de a 5 registros
    //     .exec((err, usersFind) => {
    //         if (err)
    //             return res.status(400).json({ ok: false, msg: err.message });

    //         User.count(filter, (err, total) => {
    //             res.json({ ok: true, totalReg: total, users: usersFind });
    //         })
    //     });
});

app.post('/usuario', (req, res) => {
    /** Obtiene el request */
    let body = req.body;

    /** Crea el usuario */
    let usuario = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    /** guardamos en la DB */
    usuario.save((err, userSave) => {
        if (err)
            return res.status(400).json({ ok: false, msg: err.message });

        res.json({ ok: true, usuario: userSave });
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /** Buscamos el usuario */
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userUPD) => {
        if (err)
            return res.status(400).json({ ok: false, msg: err.message });

        res.json({ ok: true, usuario: userUPD });
    });

    //res.json(`Hola en put ${req.params.id}`);
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    /** Borra el registro fisicamente */
    // User.findByIdAndRemove(id, (err, userDel) => {
    //     if (err)
    //         return res.status(400).json({ ok: false, msg: err.message });

    //     if (!userDel)
    //         return res.status(400).json({ ok: false, error: { message: 'Usuario no encontrado' } });

    //     res.json({ ok: true, usuario: userDel });
    // });

    /** hace softdelete */
    let softDel = { estado: false };
    User.findByIdAndUpdate(id, softDel, { new: true }, (err, userSoftDel) => {
        if (err)
            return res.status(400).json({ ok: false, msg: err.message });

        res.json({ ok: true, usuario: userSoftDel });
    });
});

module.exports = app;