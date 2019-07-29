var express = require('express');
var router = express.Router();

var passport = require('passport');

var cuenta = require('../controladores/registroControl');
var cuentaC = new cuenta();

var auth = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'DEBES INICIAR SESION PRIMERO');
        res.redirect('/');
    }
};

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index', {title: 'Miss You', sesion: true, info: req.flash('info'), usuario: req.user.nombre});
    } else {
        res.render('index', {title: 'Miss You', sesion: false, info: req.flash('info')});
    }

});

router.get('/logeo', function (req, res, next) {
    res.render('fragmentos/login', {title: 'Inicio de Sesion', msg: {error: req.flash('error'), info: req.flash('info')}});
});

router.get('/registro', function (req, res, next) {
    res.render('fragmentos/registro', {title: 'Registro', msg: {error: req.flash('error'), info: req.flash('info')}});
});

router.get('/testEditor', function (req, res, next) {
    res.render('fragmentos/editor', {title: 'editor'});
});

router.post('/registro', cuentaC.guardarNormal);

router.post('/inicio_sesion', passport.authenticate('local-signin',
        {successRedirect: '/',
            failureRedirect: '/logeo',
            failureFlash: true}
));

router.get('/cerrar_sesion', auth, cuentaC.cerrar_sesion);


module.exports = router;
