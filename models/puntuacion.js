'use strict';
module.exports = (sequelize, DataTypes) => {
    const puntuacion = sequelize.define('puntuacion', {
     valor:DataTypes.INTEGER,
        external_id_usuario:DataTypes.STRING
        
    }, {freezeTableName: true});
    puntuacion.associate = function (models) {
        puntuacion.belongsTo(models.pregunta, {foreignKey: 'id_pregunta'});
             

    
    };
    return puntuacion;
};