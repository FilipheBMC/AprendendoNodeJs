const express = require("express")
const router = express.Router()
// importa o Mongoose
const mongoose = require("mongoose")
// Chama o arquivo do model
require("../models/categoria")
// Chama essa função que vai chaamr uma referencia do model para uma variavel
const Categoria = mongoose.model("categorias")
//Pegando a chasse Postagem e colocando em uma const
require('../models/Postagem')
const Postagem = mongoose.model("postagens")
//Com isso aqui eu posso protejer as rotas caso o usuario não for admin
/*
Excemplo
router.get('/', eAdmin, (req, res) => {
    res.render("admin/index")
});
*/
const { eAdmin } = require("../helpers/eAdmin")

// Definindo rotas
router.get('/', (req, res) => {
    res.render("admin/index")
});

router.get('/posts', eAdmin, (req, res) => {
    res.send("Página de posts.")
})

router.get('/categoria',eAdmin, (req, res) => {
    Categoria.find().lean().sort({date: "asc"}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("erro_msg", "houve um erro ao listar as categorias")
        res.redirect("/admin")
    })

})

router.get('/categorias/add',eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova',eAdmin, (req, res) => {

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

router.get("/categorias/edit/:id",eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
    if (!categoria){
        req.flash("erro_msg", "Esta categoria não existe")
        return res.redirect("/admin/categoria")
    }
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro ao editar a categoria.")
        res.redirect("/admin/categoria")
    })
    
})

router.post("/categorias/edit",eAdmin, (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categoria")
        }).catch((err) => {
            req.flash("erro_msg", "Houve um erro ao salvar a requisição da categoria")
            res.redirect("/admin/categoria")
        })

    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro ao editar a categoria.")
        res.redirect("/admin/categoria")
    })
})

router.post("/categorias/deletar",eAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categoria")
    }).catch((err) => {
        req.flash("erro_msg", "A categoria não conseguiu ser excluida com sucesso.")
        res.redirect("/admin/categoria")
    })
})

router.get("/postagens",eAdmin, (req, res) => {

    Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("erro_msg", "houve um erro ao listar as postagens.")
        res.redirect("/admin")
    })

    
})

router.get("/postagens/add",eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro ao carregar o formulário.")
        res.redirect("/admin")
    })
})

router.post("/postagem/nova",eAdmin, (req, res) => {
    var erros = [];

    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria inválida, selecione uma categoria." });
    }

    if (erros.length > 0) {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/addpostagem", {
                erros: erros,
                categorias: categorias
            });
        }).catch((err) => {
            req.flash("erro_msg", "Erro ao carregar categorias.");
            res.redirect("/admin");
        });
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        };

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso.");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("erro_msg", "Ocorreu um erro ao salvar a postagem.");
            res.redirect("/admin/postagens");
        });
    }
});

router.get("/postagens/edit/:id",eAdmin, (req, res) => {

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {

        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias , postagem: postagem})
        }).catch((err) => {
            req.flash("erro_msg", "Houve um erro ao listar as categorias.")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro ao carregar o formulário de edição.")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit",eAdmin, (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo =       req.body.titulo,
        postagem.slug =         req.body.slug,
        postagem.descricao =    req.body.descricao,
        postagem.conteudo =     req.body.conteudo,
        postagem.categoria =    req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso.")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("erro_msg", "Erro interno")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro ao salvar a edição.")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id",eAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.params.id}).then(() => {
        res.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        res.flash("erro_msg", "Houve um erro interno ao excluir.")
        res.redirect("/admin/postagens")
    })
})
module.exports = router