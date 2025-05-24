const express = require("express")
const router = express.Router()
// importa o Mongoose
const mongoose = require("mongoose")
// Chama o arquivo do model
require("../models/categoria")
// Caham essa função que vai chaamr uma referencia do model para uma variavel
const Categoria = mongoose.model("categorias")

// Definindo rotas
router.get('/', (req, res) => {
    res.render("admin/index")
});

router.get('/posts', (req, res) => {
    res.send("Página de posts.")
})

router.get('/categoria', (req, res) => {
    Categoria.find().lean().sort({date: "asc"}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("erro_msg", "houve um erro ao listar as categorias")
        res.redirect("/admin")
    })

})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome  == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.slug ||typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "O nome não pode ter menos de 2 caracteres."})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
        return
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categoria")
        }).catch((err) => {
            req.flash("erro_msg", "Houve um erro ao tentar salva a categoria, tente novamente.")
            res.redirect("/admin")
        })
        }


})



module.exports = router