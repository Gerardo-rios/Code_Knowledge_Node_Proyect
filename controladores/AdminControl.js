'use strict ';

var uuid = require('uuid');
var models = require('./../models/');

class AdminControl {
    admin(req,res,next){
        models.usuario.findOne({where:{external_id: req.user.id},include:{model: models.cuenta, as:"cuenta",include:{model: models.rol, as:"rol"}}}).then(function (usuario){
            if(usuario.cuenta.rol.nombre =='ADMINISTRADOR'){
                next();
            }else{
                req.flash('error', 'NO AUTORIZADO');
        res.redirect('/');
            }
        }).catch(function (error){
            console.log(error);
             req.flash('error', 'NO AUTORIZADO');
        res.redirect('/');
        });
            
     
        
    }
    
    listar( req , res){
        
        var persona = models.usuario;
        var cuenta = models.cuenta;
     
        persona.findAll({include:{model: cuenta, as:"cuenta"}}).then(function(listar){
            console.log(listar[0].cuenta);
          res.render('fragmentos/admin/cuentas',{lista:listar});
        }).catch(function(error){
            console.log(error);
        });
     
    }
    
    bloquear (req,res){
        var persona = models.usuario;
        var cuenta = models.cuenta; 
        var external = req.params.external_id; 
       console.log(external);
             
        persona.findOne({where:{external_id:external},include:{model: cuenta, as:"cuenta"}}).then(function(usuario){
                    var cuenta = usuario.cuenta;
                    cuenta.activa = false;
                    cuenta.save();
                   window.reload;
                }).catch(function (error){
                    console.log(error);
                      res.redirect('/administar');
            });
        
      
        
    }
    
    desbloquear (req,res){
        var persona = models.usuario;
        var cuenta = models.cuenta; 
        var external = req.params.external_id; 
       console.log(external);
             
        persona.findOne({where:{external_id:external},include:{model: cuenta, as:"cuenta"}}).then(function(usuario){
                    var cuenta = usuario.cuenta;
                    cuenta.activa = true;
                    cuenta.save();
                      window.reload;
                }).catch(function (error){
                    console.log(error);
                      res.redirect('/administar');
            });
        
      
        
    }
    
  
 

}


module.exports = AdminControl;




