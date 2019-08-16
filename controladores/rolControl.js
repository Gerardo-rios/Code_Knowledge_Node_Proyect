"use stric";

var sequelize = require('sequelize');
var models = require('./../models/');
class rolControl {
    crear_rol() {
        var rol = models.rol;
        rol.count().then(function (roles) {
           if(roles===0){
             rol.bulkCreate([{nombre:"ADMINISTRADOR"},{nombre:"USUARIO"}]).then(function (creados){
                 console.log(creados);
             });    
           }
        }).catch(function (error){
            console.log(error);
        });
        
    }

}
module.exports = rolControl;