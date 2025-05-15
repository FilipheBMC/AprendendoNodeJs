// var http = require('http');

// http.createServer(function(req, res){
//     res.end("Ola")
// }).listen(8081);

// console.log("O servidor está rodando");

// Carregando o módulo do express
const express = require("express");

//Variavel que vai receber a função express que vem do módulo express
const app = express();

app.get("/", function(req, rest){
    rest.send("Seja bem vindo ao meu primeiro servidor rodando em node!");
});

app.get("/sobre", function(req, res){
    res.send("minha página sobre");
});

app.get("/blog", function(req, res){
    res.send("Bem vindo ao meu blog");
});

// Parâmetros

app.get('/ola/:cargo/:nome', function(req, res){
    // res.send(req.params);
    res.send("Ola " + req.params.nome + "\n O seu cargo é: " + req.params.cargo);
});



//Abrindo servidor com express
app.listen(8081, function(){
    console.log("Servidor rodando na porta 8081");
});