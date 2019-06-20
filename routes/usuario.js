// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

//Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

//rutas

//Get usuarios
app.get('/', (req, res, next) =>{
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error en el query',
                    errors: err
                });
            }
            Usuario.count({}, (err, conteo) =>{
                res.status(200).json({
                    ok:true,
                    usuarios:usuarios,
                    total: conteo
                })
            })
        })
});



//Actualizar usuario
app.put('/:id',  mdAutenticacion.verificaToken, (req, res) =>  {
    var id = req.params.id;
    Usuario.findById(id, (err, usr) => {
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el usuario',
                errors: err
            });
        }
        if(!usr){
            return res.status(400).json({
                ok:false,
                mensaje:'Usuario no encontrado',
                errors: {message: 'No existe el usuario'}
            });
        }

        var body = req.body
        usr.nombre = body.nombre;
        usr.email = body.email;
        usr.role = body.role;

        usr.save((err, usrSave) =>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar usuario',
                    errors: err
                });
            }

            usrSave.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usrSave
            })
        })
    })
});


//crear usuarios
app.post('/', mdAutenticacion.verificaToken, (req, res ) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password, 10),
        img:body.img,
        role:body.role,
    });

    usuario.save((err, usr) =>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok:true,
            usuario:usr
        })
    })
});


app.delete('/:id',  mdAutenticacion.verificaToken, (req, res) =>{
    Usuario.remove({ _id: req.params.id }, (err, usr)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar usuario',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usr
        })
    })
});

module.exports = app;