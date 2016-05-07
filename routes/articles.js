/**
 * Created by memee on 16/4/29.
 */
var express = require('express');
var router = express.Router();
var login = require('../logic/login');
var formidable = require('formidable');
var path = require('path');
var db = require('../dao/dao');
var utils = require('../utils/utils');

var PRE_PATH = '/upload/';

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

/**
 * 提交文件
 * */
var scImagesPath = '';
router.post('/uploadsc', function (req, res, next) {
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
        scImagesPath = PRE_PATH + path.basename(files.file.path) || '';
    });
    res.end();
});


/**
 * 提交文件
 * */
var imagesPath = [];
router.post('/upload', function (req, res, next) {
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
        var imgPath = files.file.path || '';

        imagesPath.push(PRE_PATH + path.basename(imgPath));
    });
    res.end();
});

/**
 * 提交作品
 * */
router.post('/edit', function(req, res, next) {
    /**
     * 写入数据库
     * */
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            throw err;
        }
        var artSql = "insert into vs_articles (title,classify_first,description,classify_second,images,date,is_safe,authorization,shortcut) values ('{title}','{classify_first}','{description}','{classify_second}','{images}','{date}','{isSafe}','{authorization}','{shortcut}')";
        artSql = artSql.replace('{title}', fields.title || '')
            .replace('{classify_first}', fields.classify_first || '')
            .replace('{description}', fields.description || '')
            .replace('{classify_second}', fields.classify_second || '')
            .replace('{images}', imagesPath.join(','))
            .replace('{isSafe}', fields.safe || '')
            .replace('{authorization}', fields.authorization || '')
            .replace('{shortcut}', scImagesPath)
            .replace('{date}', fields.date || '');
        db.query(artSql, function (err, rows, fields) {
            if (err) {
                throw err;
            }
            var is_success = rows.affectedRows || 0;
            if (is_success > 0) {
                res.redirect('/');
                imagesPath = [];
            }
        });
    });
});



/**
 * 作品详情
 * */
router.get('/detail/:id', function(req, res, next) {
    /**
     * 根据ID号查询
     * */
    var id = req.params.id;
    if (!id) {
        throw new Error('no ids');
    }
    db.query("select * from vs_articles where id='" + id + "'", function (err, rows, fields) {
        if (err) {
            throw err;
        }
        /**
         * 替换数据中图片路径
         * */
        rows = rows || [];
        for (var i=0;i<rows.length;i++) {
            rows[i].date = utils.parseTime(+new Date(rows[i].date));
            var imligt = rows[i].images.split(',');
            rows[i].images = imligt;
            rows[i].articleurl = req.originalUrl;
        }

        var articlesData = rows[0];
        res.render('article_detail', articlesData);
    });
});


module.exports = router;


