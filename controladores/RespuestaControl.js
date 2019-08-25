'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class RespuestControl {

    aceptar(req, res) {
        var respuesta = models.respuesta;
        var external = req.body.external;
        respuesta.findOne({where: {external_id: external}}).then(function (rta) {
            rta.aceptada = true;
            rta.save().then(function () {
                req.flash('info','Gracias !la respuesta ha sido \naceptada ');
                res.redirect('back');
            });
        }).catch(function (error) {
            req.flash('error','HA ocurrido un error');
                res.redirect('back');
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

    visualizar_modificar(req, res) {
        var external = req.params.external;
        var pregunta = models.pregunta;
        var respuesta = models.respuesta;

        respuesta.findOne({where: {external_id: external}}).then(function (pregunta) {
            if (pregunta) {
                res.render('fragmentos/respuesta_editar',
                        {title: 'Editar respuesta',
                            sesion: true,
                            res: pregunta,
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

        var respuesta = models.respuesta;
        var external = req.body.res_ex;
        respuesta.findOne({where: {external_id: external}}).then(function (persone) {
            var descrip = req.body.descripcion_r_e;
            descrip = descrip.replace(/\s*$/, "");
            descrip = descrip.replace(/(\r\n|\n|\r)/gm, "%0");

            var userM = persone;

            userM.descripcion = descrip;


            userM.save().then(function (result) {

                req.flash('info', 'Se ha modificado correctamente');
                res.redirect('/');
            }).error(function (error) {
                console.log(error);
                req.flash('error', 'No se pudo modificar');
                res.redirect('/');
            });
        }).error(function (error) {
            req.flash('error', 'no existe la respuesta a modificar');
            res.redirect('/');
        });
    }

}

module.exports = RespuestControl;



