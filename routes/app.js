// Requires
var express = require('express');

//Inicializar variables
var app = express();

//rutas
app.get('/', (req, resp, next) =>{
    resp.status(200).json({
        ok:true,
        mensaje:'petición realizada bien'
    })
});


module.exports = app;