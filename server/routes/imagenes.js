const express = require('express');
const path = require('path');
const fs = require('fs');
let app = express();

const { verifyTokenUrl } = require('../middlewares/authentication');

app.get('/image/:tipo/:img', verifyTokenUrl, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg))
        res.sendFile(pathImg);
    else
        res.sendFile(path.resolve(__dirname, '../assets/not-image.png'));

});

module.exports = app;