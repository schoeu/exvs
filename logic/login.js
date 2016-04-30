/**
 * Created by memee on 16/4/30.
 */

var db = require('../dao/dao');

module.exports = function (req, res, scb, fcb) {
    var username = req.session.islogined;
    if (!username) {
        fcb(username);
    }
    else {
        scb(username);
    }
};