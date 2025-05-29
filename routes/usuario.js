const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const usuario = mongoose.model("usuarios")

router.get("/registro" , (req, res) => {
    res.render("usuarios/registro")
})

module.exports = router