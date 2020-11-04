const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {


    //Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //extarer email y password
    const {email, password } = req.body;

    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });
        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //Crear el nuevo usuario
        usuario = new Usuario(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //Guardar usuario
        await usuario.save();

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
        res.status(400).send('Hubo un error');
    }
}