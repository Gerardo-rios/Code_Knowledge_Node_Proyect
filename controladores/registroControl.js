'use strict';

var models = require('./../models/');

class registroControl {

    guardar(req, res) {

        var cuenta = models.cuenta;

        var datos = {
            username: req.body.usuario,
            clave: req.body.clave
        };

        cuenta.create(datos).then(function (wason) {
            req.flash('info', "Se ha registrado Correctamente");
            res.redirect("/");
        });

    }

    cerrar_sesion(req, res) {
        req.session.destroy();
        res.redirect("/");
    }

}

module.exports = registroControl;


