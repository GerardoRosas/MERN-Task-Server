//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// api/auth

router.post('/', 
    [
        check('email', 'Agrega un email válido').not().isEmpty(),
        check('password', 'El password debe ser mínimo 6 caracteres').isLength({min: 6})
    ],
    authController.autenticarUsuario

);

module.exports = router;
