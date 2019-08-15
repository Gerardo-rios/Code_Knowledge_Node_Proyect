'use strict ';

var uuid = require('uuid');
var models = require('./../models/');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('ask', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});
var op = sequelize.Op;

class preguntaControl {

    index(req, res) {

    }

    guardar(req, res) {

        var pregunta = models.pregunta;
        var usuario = models.usuario;
        usuario.findOne({where: {external_id: req.user.id}}).then(function (result) {
            var descrip = req.body.descripcion_p;
            descrip = descrip.replace(/\s*$/, "");

            descrip = descrip.replace(/(\r\n|\n|\r)/gm, "%0");
            var datos = {
                titulo: req.body.titulo_p,
                external_id: uuid.v4(),
                descripcion: descrip,
                numero_vistas: 0,
                id_usuario: result.id
            };
            pregunta.create(datos).then(function (creado) {

                req.flash('info', 'pregunta creada correctamente');
                res.redirect('/pregunta/' + datos.external_id);

            }).catch(function (error) {
                req.flash('error', 'no se creo');
                res.redirect('/testEditor');
            });
        }).catch(function (error) {
            req.flash('error', 'debe iniciar sesion primero para poder chacer preguntas');
            res.redirect('/logeo');
        });
    }// patron de diseño dao datapbjetc  , finquelon . facade estructural
    visualizar(req, res) {

        var external = req.params.external;
        var pregunta = models.pregunta;
        var usuario = models.usuario;
//console.log(external);
        pregunta.findAll({where: {external_id: external}, include: [{model: models.respuesta, as: 'respuesta', include: [{model: models.comentario, as: 'comentario'}]}], order: [[{model: models.respuesta, as: 'respuesta'}, 'createdAt', 'DESC']]}).then(function (resulT) {
            console.log(resulT);
//        sequelize.query('SELECT'+' `pregunta`.`id`, `pregunta`.`titulo`, `pregunta`.`external_id`, `pregunta`.`descripcion`, `pregunta`.`etiqueta`, `pregunta`.`numero_vistas`, `pregunta`.`createdAt`, `pregunta`.`updatedAt`, `pregunta`.`id_usuario`, `respuesta`.`id` AS `respuesta.id`, `respuesta`.`aceptada` AS `respuesta.aceptada`, `respuesta`.`external_id` AS `respuesta.external_id`, `respuesta`.`descripcion` AS `respuesta.descripcion`, `respuesta`.`external_id_usuario` AS `respuesta.external_id_usuario`, `respuesta`.`createdAt` AS `respuesta.createdAt`, `respuesta`.`updatedAt` AS `respuesta.updatedAt`, `respuesta`.`id_pregunta` AS `respuesta.id_pregunta`, `respuesta->comentario`.`id` AS `respuesta.comentario.id`, `respuesta->comentario`.`external_id` AS `respuesta.comentario.external_id`, `respuesta->comentario`.`descripcion` AS `respuesta.comentario.descripcion`, `respuesta->comentario`.`external_id_usuario` AS `respuesta.comentario.external_id_usuario`, `respuesta->comentario`.`createdAt` AS `respuesta.comentario.createdAt`, `respuesta->comentario`.`updatedAt` AS `respuesta.comentario.updatedAt`, `respuesta->comentario`.`id_respuesta` AS `respuesta.comentario.id_respuesta` FROM `pregunta` AS `pregunta` LEFT OUTER JOIN `respuesta` AS `respuesta` ON `pregunta`.`id` = `respuesta`.`id_pregunta` LEFT OUTER JOIN `comentario` AS `respuesta->comentario` ON `respuesta`.`id` = `respuesta->comentario`.`id_respuesta` WHERE `pregunta`.`external_id` = "ab53dbf1-7c1d-49e8-8975-b1161879c493" ORDER BY `respuesta`.`createdAt` DESC;'
//,{ type:Sequelize.QueryTypes.SELECT ,nest:true,raw:true }).then(([results, metadata]) => {
// console.log(results);
// console.log(metadata);

// console.log(metadata);
        });
        //console.log(resulT[0]);   
//            if (resulT.length > 0) {
//                 var data = {};
//                var userA = resulT[0];
//                userA.increment('numero_vistas');
//                 userA.descripcion= userA.descripcion.replace(/%0/g,'\r\n');

//                userA.respuesta.forEach(function (item,index){
//                    usuario.findOne({where:{external_id:item.external_id_usuario}}).then(function (r){
//                       
//                       data[index]={
//                            username :r.nombres,
//                            imagen:r.imagen        
//                        };
//                       
//                    });
//             
//                });

//                console.log(userA.respuesta.usuario);
//                res.render('fragmentos/prueba',{user:userA});;
//                 
//            } else {
//                req.flash('error', 'Hubo un problema al intentar cargar los datos');
//                res.redirect('/');
//            }
//        }).error(function (error) {
//            req.flash('error', 'Hubo un problema, comunicate con tu servicio del sistema');
//            res.redirect('/');
//        });
    }

    visualizar_modificar(req, res) {

        var external = req.params.external;
        var pregunta = models.pregunta;
        //var cuenta = models.cuenta;

        pregunta.findOne({where: {external_id: external}}).then(function (pregunta) {

            var userE = pregunta[0];
            res.render('fragmentos/pregunta_editar',
                    {title: 'editar pregunta a lo bien',
                        sesion: true,
                        user: pregunta,
                        msg: {error: req.flash('error'), info: req.flash('info')}
                    });

        }).error(function (error) {
            req.flash('error', 'Hubo un problema al intentar cargar los datos');
            res.redirect('/testEditor');
        });

    }

    modificar(req, res) {

        var pregunta = models.pregunta;
        var external = req.body.external;
        pregunta.findOne({where: {external_id: req.params.external}}).then(function (persone) {

            var userM = persone;
            userM.titulo = req.body.titulo;
            userM.descripcion = req.body.descripcion;
            userM.pais_origen = req.body.pais;

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

function ver(data) {
    console.log(data);
}

module.exports = preguntaControl;



