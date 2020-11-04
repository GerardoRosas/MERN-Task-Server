const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { ensureIndexes } = require('../models/Usuario');

exports.autenticarUsuario = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //extarer email y password 
    const { email, password } = req.body;

    try {
        //Revisar que sea un usuario regustrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //revisar su password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password incorrecto'})
        }

        //Si todo es correcto en la validación
        //Crear y firmar el JWT
        const payload = {
            usuario:{
                id: usuario.id
            }
        };

        //Firmar el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 7200000
        }, (error, token) => {
            if(error) throw error;

            //mensaje de confirmacion
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
    
    }
}