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
        Cuenta.findOne({where: {id: id}, include: [{model: Persona},{model:models.rol,as:"rol"}]}).then(function (cuenta) {
            if (cuenta) {
                //console.log(cuenta);
                var userinfo = {
                    id: cuenta.usuario.external_id,
                    nombre: cuenta.usuario.apellidos + " " + cuenta.usuario.nombres,
                    username: cuenta.usuario.username,
                    correo: cuenta.email,
                    imagen: cuenta.usuario.imagen,
                    rol:cuenta.rol.nombre
                    
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
                Cuenta.findOne({where: {email: email,tipo_cuenta: 0}}).then(function (cuenta) {
                    if (!cuenta) {
                        return done(null, false, {message: req.flash('error', 'Cuenta no existe')});
                    }
                    if (cuenta.clave !== password) {
                        return done(null, false, {message: req.flash('error', 'Clave incorrecta')});
                    }
                    if (cuenta.activa === false) {
                        return done(null, false, {message: req.flash('error', 'Su usuario a sido bloqueado')});
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
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'emails', 'picture', 'short_name']
    },
            function (req, accessToken, refreshToken, profile, done) {
                    console.log(profile);
                //                console.log(profile);
                var a = profile.emails[0].value.split("@");
                var use_nam = (a[0] + "" + (Math.round((Math.random() * (100 - 1)) + 1) * 100) / 100 + "" + a[1].substring(0, 3).split('').reverse().join(''));
                //var Persona = persona;
                var datos = {
                    nombres: profile.displayName,
                    external_id: uuid.v4(),
                    apellidos: profile.name.familyName,
                    pais_origen: "",
                    grado_estudio: "",
                    imagen: profile.photos[0].value,
                    descripcion: "",
                    username: use_nam,
                    cuenta: {
                     
                        clave: profile.id,
                        tipo_cuenta: 1, // 0 es local //1 es facebook // 2 es google
                        email: profile.emails[0].value,
                        activa: true,
                        id_rol: 2 // rol 2 sera usuario // 1 sera admininistrador
                    }
                };


                Persona.findOrCreate({where: {'$cuenta.email$': datos.cuenta.email}, defaults: datos, include: [{model: models.cuenta, as: 'cuenta'}]}).then(function ([user, created]) {
                    // console.log(user.get({plain: true}));
                    // console.log(created);
                    if (user.cuenta.tipo_cuenta === 1) {
                        if (user.cuenta.activa === true) {
                            perfil = user.cuenta.get();
                            return done(null, perfil);
                        } else {
                            req.flash('error', "su cuenta esta bloqueda , puede ser debido a contenido inapropiado");
                            req.res.redirect('/logeo');
                            return done(null, null);

                        }
                    } else {
                        req.flash('error', "ESTAS CREDENCIALES YA ESTAN REGISTRADAS");
                        req.res.redirect('/logeo');
                        return done(null, null);


                }
                }).catch(function (error) {
                    //console.log(error);
                    return done(error, null);
                });



            }));

    passport.use(new LocalStrategyGoogle({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: '/auth/google/callback',
        passReqToCallback: true

    },
            function (req, accessToken, refreshToken, profile, done) {
                console.log(profile);
                var a = profile.emails[0].value.split("@");
                var use_nam = (a[0] + "" + (Math.round((Math.random() * (100 - 1)) + 1) * 100) / 100 + "" + a[1].substring(0, 3).split('').reverse().join(''));
                //console.log(profile);
                var datos = {
                    nombres: profile.name.givenName,
                    external_id: uuid.v4(),
                    apellidos: profile.name.familyName,
                    pais_origen: "",
                    grado_estudio: "",
                    imagen: profile._json.picture,
                    descripcion: "",
                    username: use_nam,
                    cuenta: {
                        
                        clave: profile.id,
                        tipo_cuenta: 2, // 0 es local //1 es facebook // 2 es google
                        email: profile.emails[0].value,
                        activa: true,
                        id_rol: 2 // rol 2 sera usuario // 1 sera admininistrador
                    }
                };


                Persona.findOrCreate({where: {'$cuenta.email$': datos.cuenta.email}, defaults: datos, include: [{model: models.cuenta, as: 'cuenta'}]}).then(function ([user, created]) {

                    if (user.cuenta.tipo_cuenta === 2) {
                        if (user.cuenta.activa === true) {
                            perfil = user.cuenta.get();
                            return done(null, perfil);
                        } else {
                            //console.log(accessToken +"refres: "+ refreshToken,);
                            req.flash('error', "su cuenta esta bloqueda , puede ser debido a contenido inapropiado");
                            req.res.redirect('/logeo');
                            return done(null, null);


                        }
                    } else {
                        req.flash('error', "ESTAS CREDENCIALES YA ESTAN REGISTRADAS");
                        req.res.redirect('/logeo');

                        return done(null, null);
                }

                }).catch(function (error) {
                    // console.log(error);
                    return done(error, null);
                });



            }));


}
;


