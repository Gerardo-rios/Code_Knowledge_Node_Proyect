'use strict';

var uuid = require('uuid');
var models = require('./../models/');
const sequelize = require('sequelize');
var bcrypt = require('bcrypt');
const saltROunds = 10;

class registroControl {

    guardarNormal(req, res) {

        var contra = req.body.clave;
        var persona = models.usuario;
        var cuenta = models.cuenta;
        //encriptacion
        bcrypt.hash(contra, saltROunds, function (err, hash) {
            
            var datos = {
                username: req.body.username,
                nombres: req.body.nombre_u,
                external_id: uuid.v4(),
                apellidos: req.body.apellido_u,
                pais_origen: "",
                grado_estudio: "",
                imagen: "http://assets.stickpng.com/thumbs/585e4beacb11b227491c3399.png",
                descripcion: "",
                cuenta: {
                    clave: hash,
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

                            req.flash('error', "El nombre de usuario ya se encuentra registrado, porfavor ingrese otro");
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

        });
    }

    cerrar_sesion(req, res) {
        req.session.destroy();
        res.redirect("/");
    }

}

module.exports = registroControl;



