const express = require('express');
const router = express.Router();
const usuarioscontroller = require('../controllers/usuarios-controller')

router.post('/cadastro',usuarioscontroller.postusuarios)

router.post('/login', usuarioscontroller.loginusuario)

module.exports= router;
