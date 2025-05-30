module.exports = {
    eAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }

        req.flash("erro_msg", "Você precisa ser admin.")
        res.redirect("/")

    }
}