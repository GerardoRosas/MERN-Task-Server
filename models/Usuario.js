const mongose = require('mongoose');

const UsuarioSchema = mongose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    fecha:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongose.model('Usuario', UsuarioSchema);