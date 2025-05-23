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
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("Categoria salva com sucesso!")
    }).catch((err) => {
        console.log("Erro ao salva categoria: ", err)
    })
})



module.exports = router