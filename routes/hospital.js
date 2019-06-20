var expres = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = expres();

var Hospital = require('../models/hospital');

//Get hospitales
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el get',
                    errors:err
                });
            }
            Hospital.count({}, (err, conteo) =>{
                res.status(200).json({
                    ok: true,
                    hospitales:hospitales,
                    total:conteo
                })
            })
        })
});

//Actualizar usuario
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findById(id, (err, hsptl) => {
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el hospital',
                errors: err
            })
        }

        if(!hsptl){
            return res.status(400).json({
                ok:false,
                mensaje:'Hospital no encontrado',
                errors: {message: 'No existe el hospital'}
            });
        }

        var body = req.body;
        hsptl.nombre = body.nombre;
        hsptl.usuario = req.usuario._id; 
        
        hsptl.save((err, hsptlSave) =>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hsptlSave
            })
        })
    })
});

//Crear Hospital
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre:body.nombre,
        usuario:req.usuario._id
    });

    hospital.save((err, hsptl) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error crear al hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok:true,
            hospital:hsptl
        })
    })
});

//Delete hospital
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    Hospital.remove({_id:req.params.id}, (err, hsptl) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al eliminar el hospital',
                errors: err
            });
        }

        res.status(200).json({
            ok:true,
            hospital:hsptl
        })
    })
});

module.exports = app;