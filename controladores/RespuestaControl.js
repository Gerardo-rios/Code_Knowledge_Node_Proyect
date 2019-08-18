'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class RespuestControl {
   
    aceptar(req,res){
        var respuesta = models.respuesta;
        var external = req.body_external_r;
        respuesta.findOne({where:{external_id:external}}).then(function (rta){
            rta.aceptada=true;
            rta.save().then(function (){
                
            });
        }).catch(function (error){
            
        });
        
    }


    guardar(req, res) {
        var pregunta = models.pregunta;
        var ex=req.body.external;
        var respuesta = models.pregunta;
        //var usuario = models.usuario;
        
          pregunta.findOne({where: {external_id:ex}}).then(function (resultados){
              
        var datos = {
                aceptada: false,
                 external_id_usuario: req.user.id,
                external_id: uuid.v4(),
                descripcion: req.body.descripcion,
               id_pregunta:resultados.id
        };
                respuesta.create(datos).then(function (creado) {
                    
        req.flash('info', 'respuesta creada');
           res.redirect('/pregunta/'+ex); 

                }).catch(function (error) {
        req.flash('error', 'no se creo');
                res.redirect('/testEditor');
        });
        }).catch(function (error) {
        req.flash('error', 'no se debe iniciar sesion primero para poder chacer preguntas');
                res.redirect('/logeo');
        });
    
       
    }
//        visualizar(req, res) {
//            var data = {};
//        var external = req.params.external;
//        var pregunta = models.pregunta;
//        var usuario = models.usuario;
////console.log(external);
//        pregunta.findAll({where: {external_id:external},include:[{model:models.respuesta ,as :'respuesta',include:[{model: models.comentario,as:'comentario'}]}],order:[[{model: models.respuesta, as: 'respuesta'}, 'createdAt', 'DESC']]}).then(function (resulT) {
//     
//            //console.log(resulT[0]);   
//            if (resulT.length > 0) {
//                var userA = resulT[0];
//                userA.increment('numero_vistas');
//                 userA.descripcion= userA.descripcion.replace(/%0/g,'\r\n');
//                userA.respuesta.forEach(function (index,item){
//                    usuario.findOne({where:{external_id:item.external_id_usuario}}).then(function (result){
//                        data[index]=result;
//                        
//                    });
//                    
//                }) ;
//                console.log(data);
//                res.render('fragmentos/prueba',{user:userA});
//            } else {
//                req.flash('error', 'Hubo un problema al intentar cargar los datos');
//                res.redirect('/');
//            }
//        }).error(function (error) {
//            req.flash('error', 'Hubo un problema, comunicate con tu servicio del sistema');
//            res.redirect('/');
//        });
//    }
//
//    visualizar_modificar(req, res) {
//
//        var external = req.params.external;
//        var pregunta = models.pregunta;
//        //var cuenta = models.cuenta;
//
//        pregunta.findOne({where: {external_id: external}}).then(function (pregunta) {
//           
//                var userE = pregunta[0];
//                res.render('fragmentos/pregunta_editar',
//                        {title: 'editar pregunta a lo bien',
//                            sesion: true,
//                            user: pregunta,
//                            msg: {error: req.flash('error'), info: req.flash('info')}
//                        });
//            
//        }).error(function (error) {
//            req.flash('error', 'Hubo un problema al intentar cargar los datos');
//            res.redirect('/testEditor');
//        });
//
//    }

    modificar(req, res) {
        
        var respuesta = models.respuesta;
        var external = req.body.external;
        respuesta.findOne({where: {external_id: external}}).then(function (persone) {
            
                var userM = persone;
               
                userM.descripcion = req.body.descripcion;
                
             
                userM.save().then(function (result) {
                   
                    req.flash('info', 'Se ha modificado correctamente');
                    res.redirect('/preguntal/'+external+'/edit');
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

module.exports = RespuestControl;



