'use strict ';

var uuid = require('uuid');
var models = require('./../models/');
var feach = require('sync-each');
//var op = sequelize.Op;

class AdminControl {
    /**
     * Autorizacion
     * @param {type} req
     * @param {type} res
     * @param {type} next
     * @returns {undefined}
     */
    admin(req, res, next) {
        models.usuario.findOne({where: {external_id: req.user.id}, include: {model: models.cuenta, as: "cuenta", include: {model: models.rol, as: "rol"}}}).then(function (usuario) {
            if (usuario.cuenta.rol.nombre == 'ADMINISTRADOR') {
                next();
            } else {
                req.flash('error', 'NO AUTORIZADO');
                res.redirect('/');
            }
        }).catch(function (error) {
            console.log(error);
            req.flash('error', 'NO AUTORIZADO');
            res.redirect('/');
        });



    }

    /**
     * Lista las cuentas
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    listar(req, res) {

        var persona = models.usuario;
        var cuenta = models.cuenta;

        persona.findAll({include: {model: cuenta, as: "cuenta"}}).then(function (listar) {
            res.render('fragmentos/admin/cuentas', {title: 'Cuentas', lista: listar, imagen: req.user.imagen, username: req.user.username, id: req.user.id, rol: req.user.rol});
        }).catch(function (error) {
            req.flash('error', 'no se puede cargar la data');
            res.render('fragmentos/admin/cuentas', {title: 'Cuentas', msg: {error: req.flash('error'), info: req.flash('info')}});

        });

    }

    /**
     * bloquear usuarios
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    bloquear(req, res) {
        var persona = models.usuario;
        var cuenta = models.cuenta;
        var external = req.params.external_id;

        persona.findOne({where: {external_id: external}, include: {model: cuenta, as: "cuenta"}}).then(function (usuario) {
            var cuenta = usuario.cuenta;
            cuenta.activa = false;
            cuenta.save();


            res.redirect('/administrar/usuarios');
        }).catch(function (error) {
            console.log(error);
            res.redirect('/administar');
        });



    }

    /**
     * desbloquear los usuarios
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    desbloquear(req, res) {
        var persona = models.usuario;
        var cuenta = models.cuenta;
        var external = req.params.external_id;

        persona.findOne({where: {external_id: external}, include: {model: cuenta, as: "cuenta"}}).then(function (usuario) {
            var cuenta = usuario.cuenta;
            cuenta.activa = true;
            cuenta.save();
            req.flash('info', 'usuario desbloqueado');
            res.redirect('/administrar/usuarios');
        }).catch(function (error) {
            console.log(error);
            res.redirect('/administar');
        });
    }

    /**
     * listar categorias
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    listar_categorias(req, res) {
        var categoria = models.categoria;
        categoria.findAll({include: [{model: models.pregunta, as: "categorium", attributes: ["external_id"]}]}).then(function (resultado) {
            res.render('fragmentos/admin/categoria', {title: 'Categorias', lista: resultado, imagen: req.user.imagen, username: req.user.username, id: req.user.id, rol: req.user.rol, msg: {error: req.flash('error'), info: req.flash('info')}});
        }).catch(function (error) {
            console.log(error);
            req.flash('error', 'comuniquese con soporte tecnico');
            res.redirect('/');
        });

    }

    /**
     * Guardar Categorias
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    guardar_categorias(req, res) {
        var categoria = models.categoria;
        var nombre = req.body.nombre;
        nombre = nombre.toString().toUpperCase();
        var dato = {
            nombre: nombre,
            external_id: uuid.v4()
        };

        categoria.findOrCreate({where: {nombre: nombre}, defaults: dato}).then(function ([user, created]) {

            if (created) {
                req.flash('info', 'categoria creada');
                res.redirect('/administrar/categorias');
            } else {
                req.flash('error', 'la categoria ya esta registrada');
                res.redirect('/administrar/categorias/');
        }

        }).catch(function (error) {
            console.log(error);
            req.flash('error', 'Error del sistema');
            res.redirect('/administrar/categorias');
        });



    }

    /**
     * Listar preguntas para el administrador
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    informe_pregunta(req, res) {

        var pregunta = models.pregunta;
        var persona = models.usuario;
        pregunta.findAll({atrributes: ["etiquetas", "external_id", "titulo", "id_categoria", "id_usuario", "id", "createdAt", "numero_vistas"], include: [{model: persona, as: 'usuario'}, {model: models.categoria, as: "categorium"}, {model: models.respuesta, as: 'respuesta', attributes: {exclude: ['descripcion', 'external_id_usuario', 'createdAt', 'updatedAt']}}]}).then(function (result) {
            // usuario contiene pregunta y contiene tambuien la imagen

            res.render('fragmentos/admin/preguntas', {title:'Preguntas Hechas', username: req.user.username, usuario: req.user.nombre, id: req.user.id, imagen: req.user.imagen, msg: {error: req.flash('error'), info: req.flash('info')}, lista: result, rol: req.user.rol});

        }).catch(function (error) {
            console.log(error);
            req.flash('error', 'Fallo del sistema, comuniquese con servicio tencico');

        });
    }

}


module.exports = AdminControl;




