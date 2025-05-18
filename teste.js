const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'root', '0000', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(function(){
    console.log("Conectado com o data-base!");
}).catch(function(erro){
    console.log('Deu ruim'+ erro);
});

// Usuários

//  Diferença do String para Text é que String tem um limite de tamanho.

// Criando uma tabela no banco usuarios
// const Postagem = sequelize.define('postagens', {
//     titulo: {
//         type: Sequelize.STRING
//     },
//     conteudo: {
//         type: Sequelize.TEXT
//     }
// })

Postagem.sync({force: true});

Postagem.create({
    titulo: "Qualquer titulo",
    conteudo: "Conteudo postado"
});

// const Usuarios = sequelize.define('usuarios', {
//     nome: {
//         type: Sequelize.STRING
//     },
//     sobrenome: {
//         type: Sequelize.STRING
//     },
//     idade: {
//         type: Sequelize.INTEGER
//     },
//     email: {
//         type: Sequelize.STRING
//     }
// })

Usuarios.sync({force: true});