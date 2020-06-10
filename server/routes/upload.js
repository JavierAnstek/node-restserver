const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const User = require('../models/usuario');
const Cate = require('../models/categoria');
const Prod = require('../models/producto');

// para subir imagenes
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    /** Recoge los parametros enviados */
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files)
        return res.status(400).json({ ok: false, msg: { message: 'No se ha encontrado ningun archivo para carga' } });

    /** Valida el parametro tipo */
    let tipos = ['categorias', 'productos', 'usuarios'];
    if (tipos.indexOf(tipo) < 0)
        return res.status(500).json({ ok: false, msg: { message: 'las tipos permitidos son: ' + tipos.join(', ') } });

    /** Recoge el archivo enviado */
    let archivo = req.files.archivo;
    /** Extensiones permitidas */
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    // valida extensión
    let nombreFile = archivo.name.split('.');
    let extension = nombreFile[nombreFile.length - 1];

    if (extensionesValidas.indexOf(extension) < 0)
        return res.status(500).json({ ok: false, msg: { message: 'las extensiones permitidas son: ' + extensionesValidas.join(', ') } });

    /** Cambia nombre del archivo */
    let newNameFile = `${id}-${new Date().getMilliseconds()}.${extension}`;

    /** Guarda el archivo enviado */
    archivo.mv(`uploads/${tipo}/${newNameFile}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, msg: err.message });

        /** Actualiza datos correspondientes */
        if (tipo === 'usuarios')
            imgUser(id, res, tipo, newNameFile);
        else if (tipo === 'categorias')
            imgCategory(id, res, tipo, newNameFile);
        else
            imgProduc(id, res, tipo, newNameFile);
    });
});

/** Actualiza usuario en DB */
function imgUser(id, res, tipo, nombreArchivo) {
    User.findById(id, (err, userDB) => {
        if (err) {
            delImg(tipo, nombreArchivo);
            return res.status(500).json({ ok: false, msg: err.message });
        }
        if (!userDB) {
            delImg(tipo, nombreArchivo);
            return res.status(400).json({ ok: false, msg: 'No existe el usuario' });
        }

        /** Valida la ruta de la IMG */
        delImg(tipo, userDB.img);

        /** Actualiza la img en la DB */
        userDB.img = nombreArchivo;
        userDB.save((err, userUpd) => {
            if (err)
                return res.status(500).json({ ok: false, msg: err.message });
            if (!userUpd)
                return res.status(400).json({ ok: false, msg: 'No existe el usuario' });

            return res.json({ ok: false, usuario: userUpd });
        });
    });
}

/** Actualiza categoria en DB */
function imgCategory(id, res, tipo, nombreArchivo) {
    Cate.findById(id, (err, cateDB) => {
        if (err) {
            delImg(tipo, nombreArchivo);
            return res.status(500).json({ ok: false, msg: err.message });
        }
        if (!cateDB) {
            delImg(tipo, nombreArchivo);
            return res.status(400).json({ ok: false, msg: 'No existe la Categoría' });
        }

        /** Valida la ruta de la IMG */
        delImg(tipo, cateDB.img);

        /** Actualiza la img en la DB */
        cateDB.img = nombreArchivo;
        cateDB.save((err, cateUpd) => {
            if (err)
                return res.status(500).json({ ok: false, msg: err.message });
            if (!cateUpd)
                return res.status(400).json({ ok: false, msg: 'No existe la Categoria' });

            return res.json({ ok: false, categoria: cateUpd });
        });
    });
}

/** Actualiza productos en DB */
function imgProduc(id, res, tipo, nombreArchivo) {
    Prod.findById(id, (err, prodDB) => {
        if (err) {
            delImg(tipo, nombreArchivo);
            return res.status(500).json({ ok: false, msg: err.message });
        }
        if (!prodDB) {
            delImg(tipo, nombreArchivo);
            return res.status(400).json({ ok: false, msg: 'No existe el Producto' });
        }

        /** Valida la ruta de la IMG */
        delImg(tipo, prodDB.img);

        /** Actualiza la img en la DB */
        prodDB.img = nombreArchivo;
        prodDB.save((err, prodUpd) => {
            if (err)
                return res.status(500).json({ ok: false, msg: err.message });
            if (!prodUpd)
                return res.status(400).json({ ok: false, msg: 'No existe el Producto' });

            return res.json({ ok: false, producto: prodUpd });
        });
    });
}

function delImg(tipo, img) {
    let patUrlImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(patUrlImg)) {
        fs.unlinkSync(patUrlImg);
    }
}

module.exports = app;