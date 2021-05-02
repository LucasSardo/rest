const mysql = require('../mysql').pool;
//const hdbars = require('express-handlebars');


exports.getprodutos =(req, res, next) => {
    //res.status(200).send({
    //    mensagem: 'GET na rota de produtos'
    //});
    mysql.getConnection((error,conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM produtos;', (error,result,fields)=>{
            if(error){ return res.status(500).send({ error: error }) }
            const response = {
                quantidade: result.length,
                produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.img_prod,
                            request: {
                                tipo:'GET',
                                descricao:'retorna os detalhes de um produto',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                })
            }
            return res.status(200).send({response})
        })
    })
}

exports.postprodutos =  (req, res, next) => {
    console.log(req.file)

   mysql.getConnection((error,conn)=>{
        if(error){ return res.status(500).send({ error: error }) }
       conn.query('INSERT INTO produtos (nome,preco,img_prod) VALUES(?,?,?)',[req.body.nome,req.body.preco,req.file.path],
           (error,result,field)=>{
               conn.release();
               if(error){ return res.status(500).send({ error: error }) }
            const response = {
                mensagem: 'Produto cadastrado com sucesso',
                produtoCriado: {
                    id_produto: result.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    imagem_produto: req.file.path,
                    request:{
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url:'http://localhost:3000/produtos'

                    }
                }
             }
               return res.status(201).send({response});
            }

       )
   });
      
}

exports.getpedidoespecifico = (req, res, next) => {
    //});
    mysql.getConnection((error,conn) => {
      if(error){ return res.status(500).send({ error: error }) }
      conn.query('SELECT * FROM produtos WHERE id_produto=?;',[req.params.id_produto], (error,result,fields)=>{
          if(error){ return res.status(500).send({ error: error }) }
          
          if(result.length==0){ 
              return res.status(404).send({mensagem: 'Não foi encontrado produto com este ID'
          })
          }
          const response = {
              
              produto: {
                  id_produto: result[0].id_produto,
                  nome: result[0].nome,
                  preco: result[0].preco,
                  imagem_produto: result[0].img_prod,
                  request:{
                      tipo: 'GET',
                      descricao: 'Retorna detalhes de um produto específico',
                      url:'http://localhost:3000/produtos'

                  }
              }
          }
          return res.status(200).send({response})
      })
  })
}

exports.patchprodutos = (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){ return res.status(500).send({ error: error }) }
       conn.query('UPDATE produtos SET nome=?, preco =?  WHERE id_produto=?;',[req.body.nome,req.body.preco,req.body.id_produto],
           (error,resul,field)=>{
               conn.release();
               if(error){ return res.status(500).send({ error: error }) }

               const response = {
                mensagem: 'Produto atualizado com sucesso',
                produtoAtualizado: {
                    id_produto: req.body.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    request:{
                        tipo: 'PATCH',
                        descricao: 'Altera um produto',
                        url:'http://localhost:3000/produtos/' + req.body.id_produto

                    }
                }
             }
               return res.status(202).send({response});
               
            }
        )
    });
}


exports.deleteprodutos = (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){ return res.status(500).send({ error: error }) }
       conn.query('DELETE FROM produtos WHERE id_produto=?;',[req.body.id_produto],
           (error,resul,field)=>{
               conn.release();
               const response = { 
                   mensagem:'Produto removido',
                   request:{
                       tipo:'POST',
                       descrição: 'insere um produto',
                       url: 'http://localhost:3000/produtos',
                       body: {
                           nome: 'string',
                           preco: 'float'
                       }
                   }
               }
               if(error){ return res.status(500).send({ error: error }) }

               return res.status(202).send({response});
            }
        )
    });
}