// Requires
var express = require('express');

//Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//busqueda por colleccion
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa ;

    switch(tabla){
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;
            default:
                return res.status(400).json({
                    ok:false,
                    mensaje:'Los tipos de busqueda no son correctos'
                });
    }
    promesa.then(data =>{
        res.status(200).json({
            ok:true,
            [tabla]:data
        });
    })
});

//Busqueda general
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex), 
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)])
        .then(resp => {
            res.status(200).json({
                ok:true,
                hospitales:resp[0],
                medicos:resp[1],
                usuarios:resp[2],
            });
        })
});

function buscarHospitales(busqueda, regex){
    return new Promise((resolve, reject) =>{
        Hospital.find({nombre:regex})
            .populate('usuario', 'nombre email')
            .exec((err, bus) =>{
                if(err){
                    reject('Error en la busqueda de hospitales');
                }else{
                    resolve(bus);
                }
        });
    })
}

function buscarMedicos(busqueda, regex){
    return new Promise((resolve, reject) =>{
        Medico.find({nombre:regex})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, bus) =>{
                if(err){
                    reject('Error en la busqueda de medicos');
                }else{
                    resolve(bus);
                }
        });
    })
}

function buscarUsuarios(busqueda, regex){
    return new Promise((resolve, reject) =>{
        Usuario.find({}, 'nombre email role')
            .or([{'nombre':regex}, {'email':regex}])
            .exec((err, usr) =>{
                if(err)
                    reject('error al cargar usuarios');
                else
                    resolve(usr);
            });
    })
}

module.exports = app;