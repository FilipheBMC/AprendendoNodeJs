const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/bdaprendendo").then(() => {
    console.log("Conectado ao banco de dados com sucesso!")
}).catch(() => {
    console.log("Houve um erro ao se conectar ao mongo db")
});

//  MODEL - usuarios
// Definindo o model
const UserSchema = mongoose.Schema({

    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }

});

// Falando a collection
const User = mongoose.model('User', UserSchema);

//Inserindo o usuario dentro do mongo
const novoUsuario = new User({
  nome: "Thales",
  sobrenome: "Brandão",
  email: "filipebrandao350@gmail.com",
  idade: 20,
  pais: "Brasil"
});

novoUsuario.save()
  .then(() => {
    console.log("Conseguiu enviar a informação para o Bd");
  })
  .catch((err) => {
    console.log("Houve um erro ao registrar o usuário:", err);
  });