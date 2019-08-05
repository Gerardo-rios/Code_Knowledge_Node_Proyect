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

}

module.exports = perfilControl;
