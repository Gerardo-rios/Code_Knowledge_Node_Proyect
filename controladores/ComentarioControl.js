'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class ComentarioControl {

    guardar(req, res) {
        var respuesta = models.respuesta;
        var ex = req.body.r_ex;
        var comentario = models.comentario;
        var exx = req.body.p_ex;
        var usuario = models.usuario;

        respuesta.findOne({where: {external_id: ex}}).then(function (resultados) {
            var datos = {
                external_id: uuid.v4(),
                descripcion: req.body.des_comen,
                external_id_usuario: req.user.id,
                id_respuesta: resultados.id

            };
            comentario.create(datos).then(function (creado) {

                req.flash('info', 'comentario guardado');
                res.redirect('/');

            }).catch(function (error) {
                req.flash('error', 'no se creo');
                res.redirect('/');
            });
        }).catch(function (error) {
            req.flash('error', ' se debe iniciar sesion primero para poder hacer comentarios');
            res.redirect('/logeo');
        });

    }

    visualizar_modificar(req, res) {
        var external = req.params.external;
        var comentario = models.comentario;

        comentario.findOne({where: {external_id: external}}).then(function (pregunta) {
            if (pregunta) {
                res.render('fragmentos/comentario_editar',
                        {title: 'Editar comentario',
                            sesion: true,
                            com: pregunta,
                            msg: {error: req.flash('error'), info: req.flash('info')}
                        });
            } else {
                req.flash('error', 'Hubo un problema al intentar cargar los datos');
                res.redirect('/');
            }
        }).error(function (error) {
            req.flash('error', 'Hubo un problema al intentar cargar los datos');
            res.redirect('/');
        });
    }

    modificar(req, res) {

        var comentario = models.comentario;
        var external = req.body.com_ex;
        comentario.findOne({where: {external_id: external}}).then(function (persone) {

            var comentario = persone;

            comentario.descripcion = req.body.comentarie;


            comentario.save().then(function (result) {

                req.flash('info', 'Se ha modificado correctamente');
                res.redirect('/');
                
            }).error(function (error) {
                console.log(error);
                req.flash('error', 'No se pudo modificar');
                res.redirect('/');
            });
        }).error(function (error) {
            req.flash('error', 'no existe el comentario a modificar');
            res.redirect('/');
        });
    }

}

module.exports = ComentarioControl;




