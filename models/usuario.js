var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
};

var usuarioSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es ncesario']
    },
    email: { 
        type: String, 
        unique:true, 
        required: [true, 'El correo es ncesario']
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es necesaria']
    },
    img: { 
        type: String, 
        required: false
    },
    role: { 
        type: String, 
        required: true, 
        default:'USER_ROLE',
        enum:rolesValidos
    }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El correo debe ser unico'});
module.exports = mongoose.model('Usuario', usuarioSchema);