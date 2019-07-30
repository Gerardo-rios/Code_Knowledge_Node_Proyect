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
            pais_origen: "",
            grado_estudio: "",
            imagen: "",
            descripcion: "",
            cuenta: {
                username: req.body.username,
                clave: req.body.clave,
                tipo_cuenta: 0, // 0 es local //1 es facebook // 2 es google
                email: req.body.email,
                activa: true,
                id_rol: 2 // rol 2 sera usuario // 1 sera admininistrador
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



