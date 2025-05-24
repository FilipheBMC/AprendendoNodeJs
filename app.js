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

// Configurações
    // sessão
        app.use(session({
            secret: "cursoNode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.erro_msg = req.flash("erro_msg")
            next()
        })
    // Body Parser
        app.use(bodyparser.urlencoded({extended: true}))
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
        app.use(express.static(path.join(__dirname,"public")))
//  Rotas
    //isso aqui é criando uma rota com prefixo
    app.use('/admin', admin)


// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('Servidor rodando')
})