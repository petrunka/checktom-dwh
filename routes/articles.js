var ArticleControll = require('../controllers/articleController');

module.exports = function (app, passport) {
    app.post('/searchQuery',ArticleControll.SearchArticles);

    app.post('/createArticle',ArticleControll.CreateArticle);

}