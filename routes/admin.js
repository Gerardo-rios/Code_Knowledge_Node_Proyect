var express = require('express');
var router = express.Router();
var categoria = require('../controladores/CategoriaControl');
var categoriaC = new categoria();
/* GET users listing. */
router.get('/', function(req, res, next) {
var models= require('./../models/');
    models.sequelize.sync().then(() => {
    console.log("se ha sincronizado los modelos");
    categoriaC.crear(req,res); // si no funca la sincronizacion comentar esto la primera vez y luego descomentar 
    res.send("sincronizada bd ask");
}).catch(err => {
        console.log(err,"errorsaso");
        res.send("errorsaso");

});
    
});

router.get('/cat/:token',categoriaC.api);
module.exports = router;
