var express = require('express');
var router = express.Router();

var passport = require('passport');

var cuenta = require('../controladores/registroControl');
var cuentaC = new cuenta();

var respuesta = require('../controladores/RespuestaControl');
var respuestaC = new respuesta();

var perfil = require('../controladores/perfilControl');
var perfilC = new perfil();

var rol = require('../controladores/rolControl');
var rolC = new rol();

var pregunta = require('../controladores/preguntaControl');
var preguntaC = new pregunta();

var admin = require('../controladores/AdminControl');
var adminC = new admin();

var authadmin = function (req, res, next) {
    if (req.isAuthenticated()) {
       adminC.admin(req,res,next);
    } else {
        req.flash('error', 'DEBES INICIAR SESION PRIMERO');
        res.redirect('/');
    }
};

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
    rolC.crear_rol();
    preguntaC.index(req, res);
//    if (req.isAuthenticated()) {
//        res.render('index', {title: 'Wawanakwa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}});
//    } else {
//        res.render('index', {title: 'Wawanakwa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}});
//    }

});

//administracion
router.get('/administrar/usuarios',authadmin, adminC.listar);// para prubeas comentar authadmin // valida rol Admin
router.get('/administrar/categorias',authadmin, adminC.listar_categorias); // para prubeas comentar authadmin // valida rol Admin
router.post('/administrar/categoria',authadmin, adminC.guardar_categorias);// para prubeas comentar authadmin // valida rol Admin
router.get('/administrar/preguntas',authadmin ,adminC.informe_pregunta);// para prubeas comentar authadmin // valida rol Admin
//usuario preguntas
router.get('/administrar/mispreguntas',auth ,preguntaC.mis_preguntas);
router.post('/dpregunta' ,auth,preguntaC.borrar_pregunta);
router.post('/dpreguntasAdmin' ,authadmin,preguntaC.borrar_preguntaAdmin);




router.get('/cuenta/:external_id',authadmin,adminC.bloquear);
router.get('/descuenta/:external_id', authadmin,adminC.desbloquear);


router.get('/logeo', function (req, res, next) {
    res.render('fragmentos/login', {title: 'Inicio de Sesion', msg: {error: req.flash('error'), info: req.flash('info')}});
});

router.get('/registro', function (req, res, next) {
    res.render('fragmentos/registro', {title: 'Registro', msg: {error: req.flash('error'), info: req.flash('info')}});
});

router.get('/pregunta', function (req, res, next) {
    res.render('fragmentos/editor', {title: 'Preguntar', msg: {error: req.flash('error'), info: req.flash('info')}, ask: false});
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
        passport.authenticate('facebook', {
            failureRedirect: '/logeo'

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
}));


//        router.get('/auth/google/callback', passport.authenticate('google', {
//             failureRedirect: '/logeo',
//             failureFlash: 'el correo para esta cuenta ya esta registrado ,pruebe iniciar sesion de otra forma',
//         successFlash: 'Welcome!' 
//        }),
//         function (req, res) {
//            res.redirect('/');
//        },);
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failRedirect: '/logeo'}));

//perfil del usuario
router.get('/usuario_perfil/:external', auth, perfilC.visualizar_d);

router.get('/usuario_perfil/:external/edit', auth, perfilC.visualizar_modificar);

router.post('/usuario_perfil/:external/edit/save', auth, perfilC.modificar);

// ingreso de imagenes 
router.post('/upload', function (req, res) {

    var EDfile = req.files.upload;

    var hoy = new Date();

    cad = "_" + hoy.getDate() + hoy.getMonth() + 1 + hoy.getFullYear() + '__' + hoy.getHours() + "_" + hoy.getMinutes() + "_" + hoy.getSeconds();

    EDfile.name = cad + EDfile.name;

    var dir = `./files/` + EDfile.name;



    EDfile.mv(`./files/` + EDfile.name, err => {
        console.log(err);
        if (err)
            return res.status(500).send({message: 'error tal ' + err});

        return res.status(200).send({
            "uploaded": 1,
            "fileName": EDfile.name,
            "url": `/files/` + EDfile.name
        });
    });
    console.log(EDfile.name);




});
//métodos de preguntas    
router.post('/guardarPregunta', auth, preguntaC.guardar);

router.get('/pregunta/:external', preguntaC.visualizar);



//router.get('/preguntas', function (req,res){
//    res.render('fragmentos/verPregunta');
//});

//paginacion del index para las preguntas 

router.get('/page/:page', preguntaC.paginacion);

//searchs 
router.get('/search', preguntaC.buscar);
router.get('/search/:page', preguntaC.paginacion_search);

router.post('/pregunta/responder', auth, respuestaC.guardar);

module.exports = router;
