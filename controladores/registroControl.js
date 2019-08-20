'use strict';

var uuid = require('uuid');
var models = require('./../models/');
const sequelize = require('sequelize');
class registroControl {

    guardarNormal(req, res) {

        var persona = models.usuario;
        var cuenta = models.cuenta;

        var datos = {
            username: req.body.username,
            nombres: req.body.nombre_u,
            external_id: uuid.v4(),
            apellidos: req.body.apellido_u,
            pais_origen: "",
            grado_estudio: "",
            imagen: "https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s750x750/67752579_2511565135566261_4169061585040761736_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&oh=aafefceb12d9a5d5c76925f15c0d5d0a&oe=5DD43C99&ig_cache_key=MjEwMTk2Nzk3MTA5MDI3NTc0Mw%3D%3D.2",
            descripcion: "",
            cuenta: {
                clave: req.body.clave,
                tipo_cuenta: 0, // 0 es local //1 es facebook // 2 es google
                email: req.body.email,
                activa: true,
                id_rol: 2 // rol 2 sera usuario // 1 sera admininistrador
            }
        };

        cuenta.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('email')), 'no_email']],
            where: {email: datos.cuenta.email}

        }).then(function (emails) {

            if (emails.dataValues.no_email !== 0) {
                req.flash('error', "el correo ya se encuentra registrado");
                res.redirect("/registro");
            } else {
                persona.findOne({
                    attributes: [[sequelize.fn('COUNT', sequelize.col('username')), 'no_username']],
                    where: {username: datos.username}

                }).then(function (username) {
                    var nombre = datos.username;
                    var numero = username.dataValues.no_username;
                    if (numero !== 0) {

                        req.flash('error', "El nombre de usuario ya se encuentra registrado, porfavor ingrese otro o pruebe con ");
                        res.redirect("/registro");
                    } else {
                        persona.create(datos, {include: [{model: models.cuenta, as: 'cuenta'}]}).then(function (wason) {
                            //console.log(wason);
                            req.flash('info', "Se ha registrado Correctamente");
                            res.redirect("/logeo");
                        }).error(function (error) {
                            req.flash('error', 'Fuentes');
                            res.redirect('/registro');
                        });


                    }
                }).catch(function (error) {
                    req.flash('error', "error en base ");

                });
            }
        }).catch(function (error) {
            req.flash('error', "error en base ");

        });


    }

    cerrar_sesion(req, res) {
        req.session.destroy();
        res.redirect("/");
    }

}

module.exports = registroControl;



