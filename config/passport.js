require('dotenv').config();
var models = require('./../models/');
var cuenta = models.cuenta;
var persona = models.usuario;
var uuid = require('uuid');



module.exports = function (passport) {
    var Cuenta = cuenta; //modelo
    var Persona = persona; //modelo

    var LocalStrategy = require('passport-local').Strategy;
    var LocalStrategyFace = require('passport-facebook').Strategy;
    var LocalStrategyGoogle = require('passport-google-oauth').OAuth2Strategy;
    //Permite serializar los datos de cuenta
    passport.serializeUser(function (cuenta, done) {
        //console.log(cuenta +"---___________"+cuenta);
        done(null, cuenta.id);
    });
    // Permite deserialize la cuenta de usuario
    passport.deserializeUser(function (id, done) {
        Cuenta.findOne({where: {id: id}, include: [{model: Persona}]}).then(function (cuenta) {
            if (cuenta) {
                var userinfo = {
                    id: cuenta.usuario.external_id,
                    nombre: cuenta.usuario.apellidos + " " + cuenta.usuario.nombres,
                    username: cuenta.username                    
                };
              //  console.log(userinfo);
                done(null, userinfo);
            } else {
                done(cuenta.error, null);
            }
        });
    });


    //inicio de sesion
    passport.use('local-signin', new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'pass',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, email, password, done) {
                var Cuenta = cuenta;
                Cuenta.findOne({where: {username: email}}).then(function (cuenta) {
                    if (!cuenta) {
                        return done(null, false, {message: req.flash('error', 'Cuenta no existe')});
                    }
                    if (cuenta.clave !== password) {
                        return done(null, false, {message: req.flash('error', 'Clave incorrecta')});
                    }
                    var userinfo = cuenta.get();
                    return done(null, userinfo);
                }).catch(function (err) {
                    console.log("Error:", err);
                    return done(null, false, {message: req.flash('error', 'Cuenta erronea')});
                });
            }
    ));

    passport.use(new LocalStrategyFace({

        clientID: process.env['FACEBOOK_CLIENT_ID'],
        clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
        callbackURL: '/login/facebook/return',
        enableProof: true,
        profileFields: ['id', 'displayName', 'emails', 'picture', 'short_name']
    },
            function (accessToken, refreshToken, profile, done) {
                //console.log(profile);
                //var Persona = persona;
                var datos = {
                    nombres: profile.displayName,
                    external_id: uuid.v4(),
                    apellidos: profile.short_name,
                    pais_origen: "",
                    grado_estudio: "",
                    imagen: profile.photos[0].value,
                    descripcion: "",
                    cuenta: {
                        username: profile.displayName,
                        clave: profile.id,
                        tipo_cuenta: 1, // 0 es local //1 es facebook // 2 es google
                        email: profile.emails[0].value,
                        activa: true,
                        id_rol: null // rol 0 sera usuario // 1 sera admininistrador
                    }
                };
                Persona.findOrCreate({where: {'$cuenta.clave$': profile.id}, defaults: datos, include: [{model: models.cuenta, as: 'cuenta'}]}).then(function ([user, created]) {
                   // console.log(user.get({plain: true}));
                   // console.log(created);
                    perfil = user.cuenta.get();
                    return done(null, perfil);

                }).catch(function (error) {
                    //console.log(error);
                    return done(error, null);
                });



            }));

    passport.use(new LocalStrategyGoogle({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'], 
        callbackURL:  '/auth/google/callback'
           
    },
    
            function (accessToken, refreshToken, profile, done) {
               // console.log(profile);
               
                var datos = {
                    nombres: profile.name.givenName,
                    external_id: uuid.v4(),
                    apellidos: profile.name.familyName,
                    pais_origen: profile._json.locale,
                    grado_estudio: "",
                    imagen: profile._json.picture,
                    descripcion: "",
                    cuenta: {
                        username: profile.displayName,
                        clave: profile.id,
                        tipo_cuenta: 2, // 0 es local //1 es facebook // 2 es google
                        email: profile.emails[0].value,
                        activa: true,
                        id_rol: null // rol 0 sera usuario // 1 sera admininistrador
                    }
                };
                Persona.findOrCreate({where: {'$cuenta.clave$': profile.id}, defaults: datos, include: [{model: models.cuenta, as: 'cuenta'}]}).then(function ([user, created]) {
                  //  console.log(user.get({plain: true}));
                 //   console.log(created);
                    perfil = user.cuenta.get();
                    return done(null, perfil);

                }).catch(function (error) {
                    console.log(error);
                    return done(error, perfil);
                });



            }));


}
;


