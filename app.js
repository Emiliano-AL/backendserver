// Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

//Conexión a la bd 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true })
        .then( () => {
            console.log("Base de datos: \x1b[32m%s\x1b[0m", " online")
            })
        .catch( (err) => {
            console.error(err);
});

//rutas
app.get('/', (req, resp, next) =>{
    resp.status(200).json({
        ok:true,
        mensaje:'petición realizada bien'
    })
});

//Escuchar peticiones
app.listen(3332,  ()=>{
    console.log('Express server: works!')
});