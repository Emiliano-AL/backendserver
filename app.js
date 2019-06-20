// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http');

//Inicializar variables
var app = express();

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Conexión a la bd 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true })
        .then( () => {
            console.log("Base de datos: \x1b[32m%s\x1b[0m", " online")
            })
        .catch( (err) => {
            console.error(err);
});

//Importart rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaoRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaoRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);

app.use('/', appRoutes);

//Escuchar peticiones
app.listen(5544,  ()=>{
    console.log('Express server: works!')
}); 