var express = require('express');
var router = express.Router();

var passport = require('passport');

var cuenta = require('../controladores/registroControl');
var cuentaC = new cuenta();

var perfil = require('../controladores/perfilControl');
var perfilC = new perfil();

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
        res.render('index', {title: 'Gaaaaa', sesion: true, info: req.flash('info'), usuario: req.user.nombre, id: req.user.id});
    } else {
        res.render('index', {title: 'Gaaaaa', sesion: false, info: req.flash('info')});
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

//inico de session facebook 

router.get('/login/facebook',
        passport.authenticate('facebook', {scope: ['email']}));

router.get('/login/facebook/return',
        passport.authenticate('facebook', {failureRedirect: '/logeo'
        }),
        function (req, res) {
            res.redirect('/');
        });


// inicio de google

router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
})),
        router.get('/auth/google/callback', passport.authenticate('google', {
            failureRedirect: '/logeo'
        }), function (req, res) {
            res.redirect('/');
        });

router.get('/usuario_perfil/:external', auth, perfilC.visualizar_d);

// ingreso de imagenes 
router.post('/upload',function(req,res){

    var EDfile = req.files.upload;
	console.log(EDfile);
   EDfile.mv(`./files/`+EDfile.name , err => {
        if(err) return res.status(500).send({ "upload" : 0 , "err":err });

        return res.status(200).send({
    "uploaded": 1,
    "fileName": EDfile.name,
    "url": `/files/`+EDfile.name
});
    });
    	console.log(EDfile.name);
});


module.exports = router;
