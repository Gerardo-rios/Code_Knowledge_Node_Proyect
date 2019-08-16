'use strict ';

var uuid = require('uuid');
var models = require('./../models/');
var sequelize = require('sequelize');
var feach = require('sync-each');
var op = sequelize.Op;

class preguntaControl {

    index(req, res) {

    }

    guardar(req, res) {

        var pregunta = models.pregunta;
        var usuario = models.usuario;
        usuario.findOne({where: {external_id: req.user.id}}).then(function (result) {
            var descrip = req.body.descripcion_p;
            descrip = descrip.replace(/\s*$/, "");

            descrip = descrip.replace(/(\r\n|\n|\r)/gm, "%0");
            var datos = {
                titulo: req.body.titulo_p,
                external_id: uuid.v4(),
                descripcion: descrip,
                numero_vistas: 0,
                id_usuario: result.id
            };
            pregunta.create(datos).then(function (creado) {

                req.flash('info', 'pregunta creada correctamente');
                res.redirect('/pregunta/' + datos.external_id);

            }).catch(function (error) {
                req.flash('error', 'no se creo');
                res.redirect('/testEditor');
            });
        }).catch(function (error) {
            req.flash('error', 'debe iniciar sesion primero para poder chacer preguntas');
            res.redirect('/logeo');
        });
    }// patron de diseño dao datapbjetc  , finquelon . facade estructural
   visualizar(req, res) {

        var external = req.params.external;
        var pregunta = models.pregunta;
        var usuario = models.usuario;

        pregunta.findAll({where: {external_id: external}, include: [{model: models.respuesta, as: 'respuesta', include: [{model: models.comentario, as: 'comentario'}]}]/*,order:[[{model: models.respuesta, as: 'respuesta'}, 'createdAt', 'DESC']]*/}).then(function (resulT) {


            if (resulT.length > 0) {
                // var data = [];
                var preguntaA = resulT[0];
                preguntaA.increment('numero_vistas', {silent: true});
                preguntaA.descripcion = preguntaA.descripcion.replace(/%0/g, '\r\n');
                var a = preguntaA.respuesta;

                feach(preguntaA.respuesta,
                        function (items, next) {

                            usuario.findOne({where: {external_id: items.external_id_usuario}}).then(function (user_resp) {
                                if (user_resp) {
                                    items.usuario_respuesta = {
                                        imagen: user_resp.imagen,
                                        usuario: user_resp.username
                                    };

                                    feach(items.comentario,
                                            function (it, next) {
                                                usuario.findOne({where: {external_id: it.external_id_usuario}}).then(function (user_resp_c) {
                                                    if (user_resp_c) {
                                                        it.usuario_comentario = {
                                                            imagen: user_resp_c.imagen,
                                                            usuario: user_resp_c.username
                                                        };
                                                        next(null, it);
                                                    }
                                                });

                                            },
                                            function (err, d) {
                                            });

                                    next(null, items);
                                }
                            });

                        }, function (err, data) {

                    preguntaA.respuesta = data;
                    console.log(preguntaA);
                    //res.render('fragmentos/prueba', {pregunta: preguntaA,msg:{'info':req.flash('info')}});
                      // fragmento a renderizar de pregunta  
                });

            } else {
                req.flash('error', 'Hubo un problema al intentar cargar los datos');
                res.redirect('/');
            }
        }).error(function (error) {
            req.flash('error', 'Hubo un problema, comunicate con tu servicio del sistema');
            res.redirect('/');
        });

    }

    visualizar_modificar(req, res) {

        var external = req.params.external;
        var pregunta = models.pregunta;
        //var cuenta = models.cuenta;

        pregunta.findOne({where: {external_id: external}}).then(function (pregunta) {

            var userE = pregunta[0];
            res.render('fragmentos/pregunta_editar',
                    {title: 'editar pregunta a lo bien',
                        sesion: true,
                        user: pregunta,
                        msg: {error: req.flash('error'), info: req.flash('info')}
                    });

        }).error(function (error) {
            req.flash('error', 'Hubo un problema al intentar cargar los datos');
            res.redirect('/testEditor');
        });

    }

    modificar(req, res) {

        var pregunta = models.pregunta;
        var external = req.body.external;
        pregunta.findOne({where: {external_id: req.params.external}}).then(function (persone) {

            var userM = persone;
            userM.titulo = req.body.titulo;
            userM.descripcion = req.body.descripcion;
            userM.pais_origen = req.body.pais;

            userM.save().then(function (result) {

                req.flash('info', 'Se ha modificado correctamente');
                res.redirect('/preguntal/' + external + '/edit');
            }).error(function (error) {
                console.log(error);
                req.flash('error', 'No se pudo modificar');
                res.redirect('/');
            });
        }).error(function (error) {
            req.flash('error', 'no existe la pregunta a modificar');
            res.redirect('/');
        });
    }

}


module.exports = preguntaControl;



