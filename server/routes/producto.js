const express = require('express');
const _ = require('underscore');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
let app = express();

let ProdModel = require('../models/producto');

/** Index */
app.get('/productos', [verifyToken], (req, res) => {
    let desde = Number(req.params.desde) || 0;
    ProdModel.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('categoriaId', 'categoria')
        .populate('usuarioId', 'nombre email')
        .exec((err, prodList) => {
            if (err)
                return res.status(400).json({ ok: false, msg: err.message });
            if (!prodList)
                return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

            res.json({ ok: true, productos: prodList });
        });

});

/** Index Filter */
app.get('/productos/buscar/:termino', [verifyToken], (req, res) => {
    let termino = req.params.termino;

    /** 
     * Define una expresión regular
     * para hacer eficinte la busqueda
     * i: se envia para evitar case sensitive
     */
    let regex = new RegExp(termino, 'i');

    ProdModel.find({ $or: [{ nombre: regex }, { descripcion: regex }] })
        .populate('categoriaId', 'categoria')
        .exec((err, prodList) => {
            if (err)
                return res.status(400).json({ ok: false, msg: err.message });
            if (!prodList)
                return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

            res.json({ ok: true, productos: prodList });
        });
});

/** show */
app.get('/producto/:id', [verifyToken], (req, res) => {
    let id = req.params.id;

    ProdModel.findById(id)
        .populate('categoriaId', 'categoria')
        .populate('usuarioId', 'nombre email')
        .exec((err, prodOne) => {
            if (err)
                return res.status(400).json({ ok: false, msg: err.message });
            if (!prodOne)
                return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

            res.json({ ok: true, producto: prodOne });
        });
});

/** insert */
app.post('/producto', [verifyToken], (req, res) => {
    /** Obtiene el request */
    let body = req.body;

    /** Crea el usuario */
    let prod = new ProdModel({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoriaId: body.categoria,
        usuarioId: req.usuario._id
    });

    /** guardamos en la DB */
    prod.save((err, prodSave) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });
        if (!prodSave)
            return res.status(400).json({ ok: false, msg: err.message });

        res.json({ ok: true, producto: prodSave });
    });
});

/** update */
app.put('/producto/:id', [verifyToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precio', 'descripcion', 'categoria']);

    let prodUpd = {
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoriaId: body.categoria
    };

    /** Buscamos la categoria */
    ProdModel.findByIdAndUpdate(id, prodUpd, { new: true, runValidators: true, context: 'query' }, (err, prodUpdDB) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });
        if (!prodUpdDB)
            return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

        res.json({ ok: true, producto: prodUpdDB });
    });
});

/** delete */
app.delete('/producto/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    /** hace softdelete */
    let softDel = { estado: false };
    ProdModel.findByIdAndUpdate(id, softDel, { new: true, runValidators: true, context: 'query' }, (err, prodSoftDel) => {
        if (err)
            return res.status(400).json({ ok: false, msg: err.message });
        if (!prodSoftDel)
            return res.status(401).json({ ok: false, msg: 'No se encontró registro' });

        res.json({ ok: true, cateoria: prodSoftDel });
    });
});

module.exports = app;