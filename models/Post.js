const db = require('./db');

const Post = db.sequelize.define('postagens',{
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    }
});

// Com a tabela já criada não preciso usar mais o sync
// Post.sync({force: true})

module.exports = Post