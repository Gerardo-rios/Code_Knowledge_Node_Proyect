'use strict';

var uuid = require('uuid');
var models = require('./../models/');

class registroControl {

    guardarNormal(req, res) {

        var persona = models.usuario;

        var datos = {
            nombres: req.body.nombre_u,
            external_id: uuid.v4(),
            apellidos: req.body.apellido_u,
            pais_origen: req.body.pais,
            grado_estudio: req.body.estudio,
            //imagen: req.body.avatar,
            //descripcion: req.body.description,
            cuenta: {
                username: req.body.username,
                clave: req.body.clave,
                // tipo_cuenta: DataTypes.INTEGER(1),
                email: req.body.email,
                activa: true
            }
        };

        persona.create(datos, {include: [{model: models.cuenta, as: 'cuenta'}]}).then(function (wason) {
            req.flash('info', "Se ha registrado Correctamente");
            res.redirect("/logeo");
        }).error(function (error) {
            req.flash('error', 'Fuentes');
            res.redirect('/registro');
        });

    }

    cerrar_sesion(req, res) {
        req.session.destroy();
        res.redirect("/");
    }

}

module.exports = registroControl;



