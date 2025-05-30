// Carregando módulos
const express = require("express")
const { engine } = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
const admin = require("./routes/admin")
const session = require("express-session")
const flash = require("connect-flash")
require('./models/Postagem')
const Postagens = mongoose.model("postagens")
require("./models/categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)



// Configurações
// sessão
app.use(session({
    secret: "cursoNode",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.erro_msg = req.flash("erro_msg")
    res.locals.error = req.flash("error")
    next()
})
// Body Parser
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
// Handlebars
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Mongoose
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conectado ao mongo.")
}).catch((err) => {
    console.log("Erro ao se conectar.")
})
// Public
app.use(express.static(path.join(__dirname, "public")))
//  Rotas
//isso aqui é criando uma rota com prefixo
app.get("/", (req, res) => {
    Postagens.find()
        .populate("categoria")
        .sort({ data: "desc" })
        .lean()
        .then((postagens) => {
            res.render("index", { postagens })
        }).catch((err) => {
            req.flash("erro_msg", "houve um erro interno")
            res.redirect("/404")
        })
})

app.get("/postagem/:slug", (req, res) => {
    Postagens.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("erro_msg", "Esta postagem não existe.")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro interno.")
        res.redirect("/")
    })
})

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", { categorias: categorias })
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro interno ao listar categorias.")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {

            Postagens.find({ categoria: categoria._id }).lean().then((postagens) => {
                res.render("categorias/postagens", { postagens: postagens, categoria: categoria })
            }).catch((err) => {
                req.flash("erro_msg", "Houve um erro ao carregar o post.")
                res.redirect("/")
            })

        } else {
            req.flash("erro_msg", "Esta categoria não existe.")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro interno ao carregar a página dessa categoria.")
        res.redirect("/")
    })
})

app.use('/admin', admin)
app.use("/usuarios", usuarios)

app.get("/404", (req, res) => {
    req.flash()
    res.redirect("/404")
})


// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('Servidor rodando')
})