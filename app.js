// Carregando o módulo do express
const express = require("express");

//Variavel que vai receber a função express que vem do módulo express
const app = express();

const { engine } = require("express-handlebars");
const Sequelize = require('sequelize');

// Config

    //  Template Engine
        app.engine('handlebars', engine({ defaultLayout: 'main' }));
        app.set('view engine', 'handlebars');

    //  Conexão com o banco de dados MySql
        const sequelize = new Sequelize('test', 'root', '0000', {
        host: 'localhost',
        dialect: 'mysql'
        });

// Rotas

        app.get('/cad', function(req, res){
            res.render('formulario');
        });

//Abrindo servidor com express
app.listen(8081, function(){
    console.log("Servidor rodando na porta 8081");
});