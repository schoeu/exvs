/**
 * Created by memee on 16/4/29.
 */
var express = require('express');
var router = express.Router();
var login = require('../logic/login');

/**
 * 编辑作品
 * */
router.get('/edit', function(req, res, next) {
    login(req, res, function (u) {
        res.render('edit_article', {username: u});
    }, function () {
        res.render('login');
    });
});

module.exports = router;
