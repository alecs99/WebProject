var express = require('express');
var router = express.Router();
exports.users = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

module.exports = router;
