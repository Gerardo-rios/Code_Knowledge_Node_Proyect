'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class ComentarioControl {

    guardar(req, res) {
        var respuesta = models.respuesta;
        var ex = req.body.external_r;
        var ex = req.body.external;
        var comentario = models.comentario;
        var usuario = models.usuario;

        respuesta.findOne({where: {external_id: ex}}).then(function (resultados) {
            var datos = {
                external_id: uuid.v4(),
                descripcion: req.body.descrip_comentario,
                external_id_usuario: req.user.id,
                id_respuesta: resultados.id

            };
            comentario.create(datos).then(function (creado) {

                req.flash('info', 'respuesta guardada');
                res.redirect('/pregunta/' + ex);

            }).catch(function (error) {
                req.flash('error', 'no se creo');
                res.redirect('/testEditor');
            });
        }).catch(function (error) {
            req.flash('error', ' se debe iniciar sesion primero para poder hacer coemntarios');
            res.redirect('/logeo');
        });

    }

    modificar(req, res) {

        var comentario = models.comentario;
        var external = req.body.external;
        comentario.findOne({where: {external_id: req.params.external}}).then(function (persone) {

            var comentario = persone;

            comentario.descripcion = req.body.descrip_comentario;


            comentario.save().then(function (result) {

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

module.exports = ComentarioControl;




