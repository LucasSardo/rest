const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const pedidoscontroller = require('../controllers/pedidos-controller')
const Login = require('../middleware/login')

router.get('/', pedidoscontroller.getpedidos ); //isso é uma rota

router.post('/',pedidoscontroller.postPedidos)

router.delete('/',Login.obrigatorio, pedidoscontroller.deletePedido);

router.get('/:id_pedido',pedidoscontroller.getPedidoEspecifico)


    


module.exports = router;