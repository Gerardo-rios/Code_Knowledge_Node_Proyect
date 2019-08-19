var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    var models = require('./../models/');
    models.sequelize.sync().then(() => {
        res.send("sincronizada bd ask");
    }).catch(err => {
        console.log(err, "errorsaso");
        res.send("errorsaso");

    });

});

module.exports = router;
