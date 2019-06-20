// Requires
var express = require('express');

//Inicializar variables
var app = express();

const path = require('path');
const fs = require('fs');

//rutas
app.get('/:tipo/:img', (req, res, next) =>{
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathimagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathimagen)){
        res.sendFile(pathimagen);
    }else{
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

    res.status(200).json({
        ok:true,
        mensaje:'petición realizada bien'
    })
});


module.exports = app;