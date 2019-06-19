// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('./../config/config').SEED;
//Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({email: body.email}, (err, usr) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el usuario',
                errors: err
            });
        }
        if(!usr){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if(!bcrypt.compareSync(body.password, usr.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - pass',
                errors: err
            })
        }
        //Crear un token
        usr.password = ':)';
        var token = jwt.sign(
            { usuario: usr }, 
            SEED, 
            {expiresIn:14400});

        res.status(200).json({
            ok: true,
            mensaje: usr,
            token:token,
            id:usr._id
        })
    })

    var usuario = new Usuario({
        email:body.email,
        password: bcrypt.hashSync(body.password, 10)
    });
});

module.exports = app;