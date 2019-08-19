'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class ComentarioControl {
    crear(req,res){
    
         models.categoria.count().then(function (categori) {
       if (categori==0){
             models.categoria.bulkCreate([{
            nombre:'PROGRAMACION WEB',
            external_id : uuid.v4()
        }, {  nombre:'PROGRAMACION MOVIL',
            external_id : uuid.v4()
        },{  nombre:'INTELIGENCIA ARTIFICIAL',
            external_id : uuid.v4()
        },{  nombre:'PROGRAMACION EN ESCRITORIO',
            external_id : uuid.v4()
        },{  nombre:'BASE DE DATOS',
            external_id : uuid.v4()
        },{  nombre:'ESTRUCTURA DE DATOS',
            external_id : uuid.v4()
        }],{  nombre:'OTRAS',
            external_id : uuid.v4()
        }).then(function (creado){
            
        })  ;  }
    });
         
    }
    
    api(req, res) {
        if (req.params.token=='supertoken'){
        var categoria = models.categoria;
        categoria.findAll({include:{model:models.pregunta,as:'categorium',attributes:{exclude:['titulo','descripcion','external_id','createdAt','updatedAt']}}}).then(function (cat) {
            res.json(cat);
        }).catch(function (error) {
            console.log(error);
            res.json(error);
        });
    }else{
        res.json({});
    }
}
 

}


module.exports = ComentarioControl;




