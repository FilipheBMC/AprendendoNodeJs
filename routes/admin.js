const express = require("express")
const router = express.Router()

// Definindo rotas
router.get('/', (req, res) => {
    res.render("admin/index")
});

router.get('/posts', (req, res) => {
    res.send("Página de posts.")
})

router.get('/categoria', (req, res) => {
    res.send("Página de categoria.")
})



module.exports = router