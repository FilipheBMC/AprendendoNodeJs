// Carregando o módulo do express
const express = require("express");

//Variavel que vai receber a função express que vem do módulo express
const app = express();

const { engine } = require("express-handlebars");

// usando body-parser para métodos posts
const bodyParser = require("body-parser");

// Criando constante para o model Post
const Post = require('./models/Post');

// Config

    //  Template Engine
        app.engine('handlebars', engine({ defaultLayout: 'main' }));
        app.set('view engine', 'handlebars');
    // Configurando body parser
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

// Rotas

        app.get('/cad', function(req, res){
            res.render('formulario');
        });

        app.post('/add', function(req, res){
            Post.create({
                titulo: req.body.titulo,
                conteudo: req.body.conteudo
            }).then(function(){
                res.send("Post criado com sucesso!")
            }).catch(function(erro){
                res.send("houve um erro: " + erro)
            })
        });

//Abrindo servidor com express
app.listen(8081, function(){
    console.log("Servidor rodando na porta 8081");
});