'use strict';
module.exports = (sequelize, DataTypes) => {
    const pregunta = sequelize.define('pregunta', {
        titulo: DataTypes.STRING,
        external_id: DataTypes.UUID,
        descripcion: DataTypes.TEXT,
        grado_estudio:DataTypes.STRING,
        numero_vistas:DataTypes.INTEGER
        
    }, {freezeTableName: true});
    pregunta.associate = function (models) {
        pregunta.belongsTo(models.usuario, {foreignKey: 'id_usuario'});
         pregunta.hasMany(models.respuesta, {foreignKey: 'id_pregunta',as:"pregunta"});
       pregunta.hasMany(models.puntuacion, {foreignKey: 'id_pregunta',as:"pregunta_puntuacion"});

    };
    return pregunta;
};