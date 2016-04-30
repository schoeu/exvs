var express = require('express');
var router = express.Router();
var login = require('../logic/login');

/* GET users listing. */
/**
 * 编辑个人信息
 * */
router.get('/edit', function(req, res, next) {
  login(req, res, function (u) {
    res.render('edit_personal_info', {username: u});
  }, function () {
    res.render('login');
  });
});

/**
 * 关于我
 * */
router.get('/aboutme', function (req, res, next) {
  var username = req.session.islogined;
  if (!username) {
    res.render('login');
  }
  else {
    db.query("select * from vs_users where username='" + username + "'", function (err ,rows, fields) {
      if (err) {
        throw err;
      }
      var personInfo = rows[0] || {};
      console.log()
      if (personInfo) {
        res.render('about_me', personInfo);
      }

    });

  }
});

module.exports = router;
