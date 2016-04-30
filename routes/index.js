var express = require('express');
var router = express.Router();
var db = require('../dao/dao');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.get('/login', function (req, res, next) {
  var date = db.query('select * from vs_users', function (err ,rows, fields) {
    if (err) {
      throw err;
    }

   });
  res.render('main');
});

module.exports = router;
