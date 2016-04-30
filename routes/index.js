'use strict'
var express = require('express');
var router = express.Router();
var db = require('../dao/dao');

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.islogined;
  res.render('index', {username: username});
});

/**
 * 登录
 * */
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  var postData = req.body;
  var username = postData.username;
  var password = postData.password;

  if (username) {

    db.query("select * from vs_users where username='" + username + "'", function (err ,rows, fields) {
      if (err) {
        throw err;
      }
      var dbPassword = rows[0];
      if (dbPassword.password === password) {
        req.session.islogined = username;
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
