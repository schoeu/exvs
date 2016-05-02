var express = require('express');
var router = express.Router();
var login = require('../logic/login');
var db = require('../dao/dao');
var formidable = require('formidable');
var util = require('util');
var path = require('path');

/* GET users listing. */
/**
 * 编辑个人信息
 * */

router.get('/edit', function(req, res, next) {
  var username = req.session.islogined || '';
  var querySql = "select * from vs_users where username='" + username + "'";
  if (!username) {
    res.render('login');
  }
  else {
    db.query(querySql, function (err, rows, fileds) {
      if (err) {
        throw err;
      }
      var userData = rows[0];
      if (userData) {
        userData.headicon = '/upload/' + path.basename(userData.headicon);
        res.render('edit_personal_info', userData);
      }
      else {
        throw new Error('rows is empty.')
      }
    });
  }
});

router.post('/edit', function(req, res, next) {
  var username = req.session.islogined || '';
  if (!username) {
    res.redirect('/');
  }

  // 上传头像
  var form = new formidable.IncomingForm();
  var upload_path = path.dirname(__dirname);
  form.encoding = 'utf-8';
  form.uploadDir = upload_path + "/public/upload";
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if (err) {
      throw err;
    }

    var updateSql = "update vs_users set nickname='{nickname}',qq='{qq}',userlikes='{userlikes}',email='{email}',skills='{skills}',years='{years}',description='{description}',headicon='{headicon}' where username='"+ username +"'";
    var rsSql = updateSql
        .replace('{nickname}', fields.nickname || '')
        .replace('{qq}', fields.qq || '')
        .replace('{email}', fields.email || '')
        .replace('{userlikes}', fields.userlikes || '')
        .replace('{skills}', fields.skills || '')
        .replace('{years}', fields.years || '')
        .replace('{headicon}', path.basename(files.headicon.path) || '')
        .replace('{description}', fields.description || '');

    db.query(rsSql, function (err, rows, fields) {
      if (err) {
        throw err;
      }
      /**
       * 编辑生效
       * */

      var is_success = rows.affectedRows || 0;
      if (is_success > 0) {
        res.redirect('/');
      }

    });

  });
});

/**
 * 关于我
 * */
router.get('/aboutme', function (req, res, next) {
  db.query("select * from vs_users where username='memee'", function (err ,rows, fields) {
    if (err) {
      throw err;
    }
    rows = rows || [];
    for (var i=0;i<rows.length;i++) {
      rows[i].headicon = '/upload/' + rows[i].headicon;
    }

    var personInfo = rows[0] || {};

    if (personInfo) {
      res.render('about_me', personInfo);
    }

  });
});

module.exports = router;
