var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Anvorgueza', sesion: true});
});

router.get('/logeo', function(req, res, next) {
  res.render('fragmentos/login', {title: 'Logear', sesion: false});
});

module.exports = router;
