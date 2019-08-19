'use strict';

var uuid = require('uuid');
var models = require('./../models/');

class perfilControl {

    visualizar_d(req, res) {

        var external = req.params.external;
        var user = models.usuario;
        var cuenta = models.cuenta;

        user.findAll({where: {external_id: external}, include: [{model: cuenta, as: 'cuenta'}]}).then(function (persone) {
            if (persone.length > 0) {
                var userA = persone[0];
                res.render('fragmentos/Perfil_User',
                        {title: 'Perfil a lo bien, si me entiende',
                            sesion: true,
                            user: userA,
                            msg: {error: req.flash('error'), info: req.flash('info')}
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
        var user = models.usuario;
        var cuenta = models.cuenta;

        user.findAll({where: {external_id: external}, include: [{model: cuenta, as: 'cuenta'}]}).then(function (persone) {
            if (persone.length > 0) {
                var userE = persone[0];
                res.render('fragmentos/perfil_user_edit',
                        {title: 'edit a lo bien',
                            sesion: true,
                            user: userE,
                            msg: {error: req.flash('error'), info: req.flash('info')}
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

    modificar(req, res) {
        var user = models.usuario;
        var cuenta = models.cuenta;
        var external = req.body.external;        
        user.findAll({where: {external_id: req.params.external}, include: [{model: cuenta, as: 'cuenta'}]}).then(function (persone) {
            if (persone.length > 0) {
                var userM = persone[0];
                userM.apellidos = req.body.second_name;
                userM.nombres = req.body.name;
                userM.pais_origen = req.body.pais;
                userM.grado_estudio = req.body.educacion;
                //userM.imagen = req.body.imagen;
                userM.descripcion = req.body.descripcion;
                userM.save().then(function (result) {
                    var cuentM = userM.cuenta;
                    cuentM.username = req.body.username;
                    cuentM.email = req.body.email;
                    cuentM.clave = req.body.clave_n;
                    cuentM.save();                    
                    req.flash('info', 'Se ha modificado correctamente');
                    res.redirect('/usuario_perfil/'+external);
                }).error(function (error) {
                    console.log(error);
                    req.flash('error', 'No se pudo modificar');
                    res.redirect('/usuario_perfil/' + external);
                });


            } else {
                req.flash('error', 'No existe el dato a buscar');
                res.redirect('/usuario_perfil/' + external);
            }
        }).error(function (error) {
            req.flash('error', 'se produjo un error');
            res.redirect('/');
        });
    }

}

module.exports = perfilControl;
