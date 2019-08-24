'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class RespuestControl {

    aceptar(req, res) {
        var respuesta = models.respuesta;
        var external = req.body_external_r;
        respuesta.findOne({where: {external_id: external}}).then(function (rta) {
            rta.aceptada = true;
            rta.save().then(function () {

            });
        }).catch(function (error) {

        });

    }

    guardar(req, res) {
        var pregunta = models.pregunta;
        var ex = req.body.p_ex;
        var respuesta = models.respuesta;
        //var usuario = models.usuario;

        pregunta.findOne({where: {external_id: ex}}).then(function (resultados) {
            var descrip = req.body.descripcion_r;
            descrip = descrip.replace(/\s*$/, "");
            descrip = descrip.replace(/(\r\n|\n|\r)/gm, "%0");
            var datos = {
                aceptada: false,
                external_id_usuario: req.user.id,
                external_id: uuid.v4(),
                descripcion: descrip,
                id_pregunta: resultados.id
            };
            respuesta.create(datos).then(function (creado) {

                req.flash('info', 'respuesta creada');
                res.redirect('/pregunta/' + ex);

            }).catch(function (error) {
                req.flash('error', 'no se creo');
                res.redirect('/pregunta/' + ex);
            });
        }).catch(function (error) {
            req.flash('error', 'Hubo un problema comunicate con el administrador');
            res.redirect('/pregunta/' + ex);
        });


    }

    modificar(req, res) {

        var respuesta = models.respuesta;
        var external = req.body.external;
        respuesta.findOne({where: {external_id: external}}).then(function (persone) {

            var userM = persone;

            userM.descripcion = req.body.descripcion;


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

module.exports = RespuestControl;



