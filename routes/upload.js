// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
//Inicializar variables
var app = express();
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

//rutas
app.put('/:tipo/:id', (req, res, next) =>{
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            mensaje:'tipo no valida',
            errors: {message: 'los tipos validas son ' + tiposValidos.join(',')}
        })
    }

    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'archivo no seleccionado',
            errors: {message: 'Debe seleccionar una imagen'}
        })
    }
    //validar si el file es una imagen 
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok:false,
            mensaje:'Extensión no valida',
            errors: {message: 'las extensiones validas son ' + extensionesValidas.join(',')}
        })
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al mover el archivo',
                errors: err
            })
        }
    })
    subirPorTipo(tipo, id, nombreArchivo, res);
   
});

function subirPorTipo(tipo, id, nombreArchivo, res){
    if(tipo === 'usuario'){
        Usuario.findById(id, (err, usuario) =>{
            if(!usuario){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Usuarios no existe',
                    errors: {message:'Usuario no existe'}
               })
            }
            var pathOld = './uploads/usuarios/' + usuario.img;
            //si existe elimina la imagen anterior
            if(fs.existsSync(pathOld)){
                fs.unlink(pathOld);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) =>{
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok:true,
                    mensaje:'Archivo subido correctamente',
                    usuario: usuarioActualizado
               })
            });
        })
    }
    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico) => {
            if(!medico){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Medico no existe',
                    errors: {message:'Medico no existe'}
               })
            }
            var pathOld = './uploads/medicos/' + medico.img;
            //si existe elimina la imagen anterior
            if(fs.existsSync(pathOld)){
                fs.unlink(pathOld);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok:true,
                    mensaje:'Archivo subido correctamente',
                    medico: medicoActualizado
                })
            })
        })
    }
    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hsptl) => {
            if(!hsptl){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Hospital no existe',
                    errors: {message:'Hospital no existe'}
               })
            }
            var pathOld = './uploads/hospital/' + hsptl.img;
            //si existe elimina la imagen anterior
            if(fs.existsSync(pathOld)){
                fs.unlink(pathOld);
            }
            hsptl.img = nombreArchivo;
            hsptl.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok:true,
                    mensaje:'Archivo subido correctamente',
                    medico: hospitalActualizado
                })
            })
        });
    }
}


module.exports = app;