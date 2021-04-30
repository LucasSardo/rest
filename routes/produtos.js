const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer'); // EXTENSAO PARA HABILITAR O UPLOAD DE ARQUIVOS
const Login = require('../middleware/login')

const produtoscontroller = require('../controllers/produtos-controller')
//DEFINE O NOME DO PRODUTO QUE VAI SER UPADO
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){ 

        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
        //cb(null,new Date().toISOString().replace(':/g,'-') + file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png'){
        cb(null,true);
    } else { 
        cb(null,false);
    }

}

const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
    }); //CHAMA A EXTENSAO DE UPLOAD E DEFINE A PASTA UPLOAD COMO DESTINO


router.get('/', produtoscontroller.getprodutos);

router.post('/',Login.obrigatorio,upload.single('produto-img'),produtoscontroller.postprodutos);

router.patch('/',Login.obrigatorio, produtoscontroller.patchprodutos );

router.delete('/',Login.obrigatorio, produtoscontroller.deleteprodutos);

router.get('/:id_produto',produtoscontroller.getpedidoespecifico);


module.exports = router;