var express = require('express');
var router = express.Router();
var db = require('../dao/dao');
var Promise = require('bluebird');
var path = require('path');
var utils = require('../utils/utils');

var PRE_PATH = '/upload/';

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.islogined;
  getData(0, 8).then(function (artlist) {
    /**
     * 替换数据中图片路径
     * */
    for (var i=0;i<artlist.length;i++) {
      artlist[i].shortcut = PRE_PATH + path.basename(artlist[i].shortcut);
      artlist[i].date = utils.parseTime(+new Date(artlist[i].date));
    }

    /**
     * 为数据分组
     * */
    var artObjList = [];
    var artlistLen = artlist.length || 0;
    var rowsCount = Math.ceil(artlistLen / 4);
    for (var j=0;j<rowsCount;j++) {
      artObjList.push(artlist.slice(4*j, 4*(j+1)));
    }

    res.render('index', {username: username, artlist: artObjList, length:artlist.length});
  }).catch(function(e){
    throw e;
  });
});

router.get('/getarticles', function (req, res, next) {
  var s = req.query.s || 0;
  var e = req.query.e || -1;
  getData(s, e).then(function (artlist) {
    var lth = artlist.length || 0;

    /**
     * 替换数据中图片路径
     * */
    for (var i=0;i<lth;i++) {
      artlist[i].shortcut = PRE_PATH + path.basename(artlist[i].shortcut);
      artlist[i].date = utils.parseTime(+new Date(artlist[i].date));
    }
    if (lth) {
      res.json({"errno":0, "data": artlist});
    }
    else {
      res.json({"errno":1});
    }
  }).catch(function(e){
    throw e;
  });
});

// 作品查询
function getData(s, n) {
  return new Promise(function (resolve, reject) {
    var querySql = "select * from vs_articles limit " + s + "," + n;
    db.query(querySql, function (err, rows, fileld) {
      if (err) {
        reject(err);
      }
      return resolve(rows || []);
    });
  });
}

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
        /**
         * 登录session过期时间为一天
         * */
        var hour = 3600000;
        req.session.cookie.expires = new Date(Date.now() + hour);
        req.session.cookie.maxAge = hour;
        req.session.islogined = username;

        /**
         * 跳转至首页
         * */
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
