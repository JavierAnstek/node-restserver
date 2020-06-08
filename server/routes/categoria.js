const express = require('express');
const _ = require('underscore');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
let app = express();

let CatModel = require('../models/categoria');
let User = require('../models/usuario');

/** Index */
app.get('/categorias', [verifyToken], (req, res) => {
    CatModel.find({}, (err, CatList) => {
        User.populate(CatList, { path: 'usuarioId' }, (err, CatList) => {
            if (err)
                return res.status(400).json({ ok: false, msg: err.message });
            if (!CatList)
                return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

            res.json({ ok: true, cateorias: CatList });
        });
    });
});

/** show */
app.get('/categoria/:id', [verifyToken], (req, res) => {
    let id = req.params.id;

    CatModel.findById(id, (err, CatOne) => {
        User.populate(CatOne, { path: 'usuarioId', select: 'nombre email' }, (err, CatOne) => {
            if (err)
                return res.status(400).json({ ok: false, msg: err.message });
            if (!CatOne)
                return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

            res.json({ ok: true, cateoria: CatOne });
        });
    });
});

/** insert */
app.post('/categoria', [verifyToken], (req, res) => {
    /** Obtiene el request */
    let body = req.body;
    // return res.json({ ok: true, usuario: req.usuario });

    /** Crea el usuario */
    let Cate = new CatModel({
        categoria: body.categoria,
        usuarioId: req.usuario._id
    });

    /** guardamos en la DB */
    Cate.save((err, cateSave) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });
        if (!cateSave)
            return res.status(400).json({ ok: false, msg: err.message });

        res.json({ ok: true, cateoria: cateSave });
    });
});

/** update */
app.put('/categoria/:id', [verifyToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['categoria']);
    let categoriaUpd = { categoria: body.categoria };
    // return res.json({ id: id, info: req.body.categoria, categoriaUpd });

    /** Buscamos la categoria */
    CatModel.findByIdAndUpdate(id, categoriaUpd, { new: true, runValidators: true, context: 'query' }, (err, cateUpd) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });
        if (!cateUpd)
            return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

        res.json({ ok: true, cateoria: cateUpd });
    });
});

/** delete */
app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    /** hace softdelete */
    let softDel = { estado: false };
    CatModel.findByIdAndUpdate(id, softDel, { new: true, runValidators: true, context: 'query' }, (err, catSoftDel) => {
        if (err)
            return res.status(400).json({ ok: false, msg: err.message });
        if (!catSoftDel)
            return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

        res.json({ ok: true, cateoria: catSoftDel });
    });
});

module.exports = app;