            const express=require('express');
            const app = express();
            const morgan = require('morgan');
            const bodyParser = require('body-parser')



            app.use('/css',express.static('css'));


            const hdbars = require('express-handlebars');
            //app.engine('handlebars',hdbars  ({defaultLayout:'Main'}));
            app.engine('handlebars', hdbars({extname: "handlebars",defaultLayout: "Main", layoutsDir: "./views/layouts", }));


            app.set('view engine','handlebars');

            const rotaProdutos = require('./routes/produtos');
            const rotaPedidos = require('./routes/pedidos');
            const rotaUsuarios = require('./routes/usuarios');

            app.use(morgan('dev'));//EXTENSAO QUE DA RESPOSTAS DE GET E POST
            app.use('/uploads',express.static('uploads'))
            app.use(bodyParser.urlencoded({extended: false}));
            app.use(bodyParser.json());

            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header(
                    'Access-Control-Allow-Headers', 
                    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                );
                
                if (req.method==='OPTIONS'){
                    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET, OPTIONS');
                    return res.status(200).send({})
                }
            
                next();
            })

            app.use('/produtos', rotaProdutos);
            app.use('/pedidos', rotaPedidos);
            app.use('/usuarios', rotaUsuarios);

            app.get("/", (req, res) =>{ 
                //res.send('ROTA DO BasasARRA'); 
                //res.sendFile(__dirname+'/views/index.html')
                //return res.send("você está no barra")
                //return res.render(__dirname+'/views/index');
                return res.render('index');
                
            
            }) 



            //QUANDO NÃO ENCONTRA A ROTA
            app.use((req, res, next) =>{
                const erro=new Error('Não encontrado');
                erro.status=404;
                next(erro);
            })

            app.use((error, req, res, next) =>{
                res.status(error.status|| 500);
                 return res.send({
                     erro:{
                         mensagem:error.message
                     }
                 });
            });

            module.exports =app