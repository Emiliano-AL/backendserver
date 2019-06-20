var expres = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = expres();

var Medico = require('../models/medico');

//Get médicos
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medico) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error en el get',
                    errors:err
                });
            }
            Medico.count({}, (err, conteo) =>{
                res.status(200).json({
                    ok:true,
                    medico:medico,
                    total:conteo
                });
            });
        })
});

//Actualizar medico
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findById(id, (err, mdc) => {
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el medico',
                errors:err
            })
        }

        if(!mdc){
            return res.status(400).json({
                ok:false,
                mensaje:'Medicos nos encontrados',
                errors: {message: 'No existe el médico'}
            });
        }

        var body = req.body;
        mdc.nombre = body.nombre;
        mdc.usuario = req.usuario._id; 
        mdc.hospital = body.hospital; 

        mdc.save((err, mdcSave) =>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar el médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: mdcSave
            })
        })
    })
});

//Crear medico
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre:body.nombre,
        usuario: req.usuario._id,
        hospital :hospital 
    });

    medico.save((err, mdc) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error crear al médico',
                errors: err
            })
        }

        res.status(201).json({
            ok:true,
            medico:mdc
        })
    })
});

//Delete hospital
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    Medico.remove({_id:req.params.id}, (err, mdc) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al eliminar el medico',
                errors: err
            });
        }

        res.status(200).json({
            ok:true,
            medico:mdc
        })
    })
});

module.exports = app;