const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro" , (req, res) => {
    res.render("usuarios/registro")
})

//
//  Inserindo, fazendo um hash e fazendo uma pesquisa por CPF para saber se o já tem um usuário cadastrado com os mesmo e-mail.
//

router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null)
        erros.push({texto: "Nome inválido."})

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null)
        erros.push({texto: "E-mail inválido."})

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null)
        erros.push({texto: "Senha inválida."})

    if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null)
        erros.push({texto: "Senha de confirmação inválida inválida."})

    if(req.body.senha.length < 4)
        erros.push({texto: "Senha muito pequena."})

    if(req.body.senha != req.body.senha2)
        erros.push({texto: "A senha de confirmação deve ser igual a senha."})

    if(erros.length > 0){

        res.render("usuarios/registro", {erros: erros})

    }else{
        
        usuario.findOne({email: req.body.email}).lean().then((usuarioExistente) => {
            if(usuarioExistente){
                req.flash("erro_msg", "Já existe uma conta com este e-mail em nosso sistema.")
                res.redirect("/usuarios/registro")
            }
            else{

                const novoUsuario = new usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha

                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if(erro){
                            req.flash("erro_msg", "Houve um erro durante o salvamento do usuário.")
                            return res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        console.log("Quero ver o valor do hash: " + novoUsuario.senha)
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "usuário criado com sucesso.")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("erro_msg", "Houve um problema interno ao criar usuario.")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("erro_msg", "Houve um erro interno.")
            res.redirect("/")
        })

    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)

})

module.exports = router