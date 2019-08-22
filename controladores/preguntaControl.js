'use strict ';

var uuid = require('uuid');
var models = require('./../models/');
var sequelize = require('sequelize');
var feach = require('sync-each');
var op = sequelize.Op;
const mostrar = 5;
class preguntaControl {

    buscar(req, res) {
        var paginas = 1;
        var pagina = req.params.page;
        var limite = mostrar * pagina;
        var quita = (pagina - 1) * mostrar;
        var persona = models.usuario;
        var pregunta = models.pregunta;
        var respuesta = models.respuesta;
        var data = [];
        var texto = req.query.texto;

        var criterio = req.query.criterio;
        if (criterio == "") {
            if (texto == "") {
                res.redirect('/');
            } else {
                pregunta.findAll({where: {titulo: {[op.substring]: texto}}, limit: mostrar, include: [{model: models.categoria, as: "categorium"}, {model: persona, as: 'usuario'}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
                    // usuario contiene pregunta y contiene tambuien la imagen

                    pregunta.count({where: {titulo: {[op.substring]: texto}}}).then(function (no_preguntas) {
                        paginas = Math.ceil(no_preguntas / mostrar);

                        feach(result, function (item, next) {
                            var descrip = item.descripcion;
                            descrip = descrip.replace(/%0/gm, "\r\n");
                            item.descripcion = descrip;
                            item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');

                            next(null, item);

                        }, function (err, data) {
                            var b = {
                                texto: texto,
                                criterio: criterio,
                                cantidad: no_preguntas};

                            if (req.isAuthenticated()) {
                                res.render('index', {rol:req.user.rol,title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                            } else {
                                res.render('index', {title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                            }
                        });

                    });


                }).catch(function (error) {
                    console.log(error);
                });

            }
        } else if (criterio == "etiquetas") {

            texto = texto.split(",");

            console.log(texto);
            pregunta.findAll({where: {etiquetas: {[op.substring]: texto}}, limit: mostrar, include: [{model: models.categoria, as: 'categorium'}, {model: persona, as: 'usuario'}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
                // usuario contiene pregunta y contiene tambuien la imagen

                pregunta.count({where: {etiquetas: {[op.substring]: texto}}}).then(function (no_preguntas) {
                    paginas = Math.ceil(no_preguntas / mostrar);
                  
                    feach(result, function (item, next) {
                        var descrip = item.descripcion;
                        descrip = descrip.replace(/%0/gm, "\r\n");
                        item.descripcion = descrip;
                        item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');

                        next(null, item);

                    }, function (err, data) {
                        var b = {
                            texto: texto,
                            criterio: criterio,
                            cantidad: no_preguntas};

                        if (req.isAuthenticated()) {
                            res.render('index', {rol:req.user.rol,title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        } else {
                            res.render('index', {title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        }
                    });

                });


            }).catch(function (error) {
                console.log(error);
            });

        } else if (criterio == 'categoria') {
            texto = texto.toUpperCase();

            pregunta.findAll({limit: mostrar, include: [{model: persona, as: 'usuario'}, {model: models.categoria, as: 'categorium', where: {nombre: {[op.substring]: texto}}}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
                // usuario contiene pregunta y contiene tambuien la imagen

                pregunta.count({include: [{model: models.categoria, as: 'categorium', where: {nombre: {[op.substring]: texto}}}]}).then(function (no_preguntas) {
                    paginas = Math.ceil(no_preguntas / mostrar);

                    feach(result, function (item, next) {
                        var descrip = item.descripcion;
                        descrip = descrip.replace(/%0/gm, "\r\n");
                        item.descripcion = descrip;
                        item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');

                        next(null, item);

                    }, function (err, data) {
                        var b = {
                            texto: texto,
                            criterio: criterio,
                            cantidad: no_preguntas};

                        if (req.isAuthenticated()) {
                            res.render('index', {rol:req.user.rol,title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        } else {
                            res.render('index', {title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        }
                    });

                });


            }).catch(function (error) {
                console.log(error);
            });

        } else {
            res.redirect('/');
        }

    }

    paginacion_search(req, res) {
        var paginas = 1;
        var pagina = req.params.page;
        var limite = mostrar * pagina;
        var quita = (pagina - 1) * mostrar;
        var persona = models.usuario;
        var pregunta = models.pregunta;
        var respuesta = models.respuesta;
        var texto = req.query.texto;

        var criterio = req.query.criterio;

        if (criterio == "") {
            if (texto == "") {
                res.redirect('/');
            } else {
                pregunta.findAll({offset: quita, where: {titulo: {[op.substring]: texto}}, limit: mostrar, include: [{model: models.categoria, as: "categorium"}, {model: persona, as: 'usuario'}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
                    // usuario contiene pregunta y contiene tambuien la imagen

                    pregunta.count({where: {titulo: {[op.substring]: texto}}}).then(function (no_preguntas) {
                        paginas = Math.ceil(no_preguntas / mostrar);
                        console.log(paginas);
                        feach(result, function (item, next) {
                            var descrip = item.descripcion;
                            descrip = descrip.replace(/%0/gm, "\r\n");
                            item.descripcion = descrip;
                            item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');

                            next(null, item);

                        }, function (err, data) {

                            var b = {
                                texto: texto,
                                criterio: criterio,
                                cantidad: no_preguntas};

                            if (req.isAuthenticated()) {
                                res.render('index', {rol:req.user.rol,title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b, page: pagina});
                            } else {
                                res.render('index', {title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b, page: pagina});
                            }
                        });

                    });


                }).catch(function (error) {
                    console.log(error);
                });

            }
        } else if (criterio == "etiquetas") {



            pregunta.findAll({offset: quita, where: {etiquetas: {[op.substring]: texto}}, limit: mostrar, include: [{model: models.categoria, as: 'categorium'}, {model: persona, as: 'usuario'}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
                // usuario contiene pregunta y contiene tambuien la imagen

                pregunta.count({where: {etiquetas: {[op.substring]: texto}}}).then(function (no_preguntas) {
                    paginas = Math.ceil(no_preguntas / mostrar);
                    if (paginas === 0) {
                        paginas = 1;
                    }
                    feach(result, function (item, next) {
                        var descrip = item.descripcion;
                        descrip = descrip.replace(/%0/gm, "\r\n");
                        item.descripcion = descrip;
                        item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');

                        next(null, item);

                    }, function (err, data) {


                        var b = {
                            texto: texto,
                            criterio: criterio,
                            cantidad: no_preguntas};

                        if (req.isAuthenticated()) {
                            res.render('index', {rol:req.user.rol,page: pagina, title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        } else {
                            res.render('index', {page: pagina, title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        }
                    });

                });


            }).catch(function (error) {
                console.log(error);
            });

        } else if (criterio == 'categoria') {
            texto = texto.toUpperCase();
            pregunta.findAll({offset: quita, limit: mostrar, include: [{model: persona, as: 'usuario'}, {model: models.categoria, as: 'categorium', where: {nombre: {[op.substring]: texto}}}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
                // usuario contiene pregunta y contiene tambuien la imagen

                pregunta.count({include: [{model: models.categoria, as: 'categorium', where: {nombre: {[op.substring]: texto}}}]}).then(function (no_preguntas) {
                    paginas = Math.ceil(no_preguntas / mostrar);
                    if (paginas === 0) {
                        paginas = 1;
                    }
                    feach(result, function (item, next) {
                        var descrip = item.descripcion;
                        descrip = descrip.replace(/%0/gm, "\r\n");
                        item.descripcion = descrip;
                        item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');

                        next(null, item);

                    }, function (err, data) {
                        var b = {
                            texto: texto,
                            criterio: criterio,
                            cantidad: no_preguntas};

                        if (req.isAuthenticated()) {
                            res.render('index', {page: pagina, title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b,rol:req.user.rol});
                        } else {
                            res.render('index', {page: pagina, title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, search: true, b: b});
                        }
                    });

                });


            }).catch(function (error) {
                console.log(error);
            });

        } else {
            res.redirect('/');
        }

    }
    paginacion(req, res) {
        var pagina = req.params.page * 1;
        if (pagina === 1) {
            res.redirect("/");
        }
        var paginas = 1;
        var pregunta = models.pregunta;
        var persona = models.usuario;
        var limite = mostrar * pagina;
        var quita = (pagina - 1) * mostrar;
        pregunta.findAll({offset: quita, limit: mostrar, include: [{model: persona, as: 'usuario'}, {model: models.categoria, as: 'categorium'}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
            // usuario contiene pregunta y contiene tambuien la imagen
            console.log(result);
            pregunta.count().then(function (no_preguntas) {
                paginas = Math.ceil(no_preguntas / mostrar);
                if (pagina > paginas) {
                    req.flash("error", "no existen tantas paginas no seas verga no me botes el sistema ");
                    res.redirect("/");

                } else {
                    feach(result, function (item, next) {
                        var descrip = item.descripcion;
                        descrip = descrip.replace(/%0/gm, "\r\n");

                        item.descripcion = descrip;

                        item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');


                        next(null, item);
                        // console.log(item);
                    }, function (err, data) {
                        if (req.isAuthenticated()) {
                            res.render('index', {title: 'Gaaaaa', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, page: pagina, index: true,rol:req.user.rol});
                        } else {
                            res.render('index', {title: 'Gaaaaa', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, page: pagina, index: true});
                        }
                    });
                }
                ;



            });

        }).catch(function (error) {
            console.log(error);
        });


    }

    index(req, res) {
        var paginas = 1;
        var pregunta = models.pregunta;
        var persona = models.usuario;
        pregunta.findAll({limit: mostrar, include: [{model: persona, as: 'usuario'}, {model: models.categoria, as: "categorium"}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['aceptada', 'descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}], order: [['createdAt', 'DESC']]}).then(function (result) {
            // usuario contiene pregunta y contiene tambuien la imagen
            pregunta.count().then(function (no_preguntas) {
                paginas = Math.ceil(no_preguntas / mostrar);

                feach(result, function (item, next) {
                    var descrip = item.descripcion;
                    descrip = descrip.replace(/%0/gm, "\r\n");

                    item.descripcion = descrip;

                    item.dia = item.createdAt.toJSON().slice(0, 19).replace('T', ' ');


                    next(null, item);
                    // console.log(item);
                }, function (err, data) {
                    if (req.isAuthenticated()) {
                        res.render('index', {title: 'C-K-U', sesion: true, username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, index: true,rol:req.user.rol});
                    } else {
                        res.render('index', {title: 'C-K-U', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, preguntas: result, paginas: paginas, index: true});
                    }
                });

            });


        }).catch(function (error) {
            console.log(error);
        });
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
                id_usuario: result.id,
                etiquetas: req.body.etiquetas,
                id_categoria: req.body.categoria_p
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

        pregunta.findAll({where: {external_id: external}, include: [{model: models.categoria, as: 'categorium'}, {model: models.respuesta, as: 'respuesta', include: [{model: models.comentario, as: 'comentario'}]}]/*,order:[[{model: models.respuesta, as: 'respuesta'}, 'createdAt', 'DESC']]*/}).then(function (resulT) {


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
                    if (req.isAuthenticated()) {
                        res.render('fragmentos/editor', {title: 'Preguntar nunca dejar debes', sesion: true, msg: {error: req.flash('error'), info: req.flash('info')}, ask: true, pregunta: preguntaA,rol:req.user.rol});
                    } else {
                        res.render('fragmentos/editor', {title: 'Preguntar nunca dejar debes', sesion: false, msg: {error: req.flash('error'), info: req.flash('info')}, ask: true, pregunta: preguntaA});
                    }

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



