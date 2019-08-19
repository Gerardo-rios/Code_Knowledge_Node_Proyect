'use strict';
module.exports = (sequelize, DataTypes) => {
    const pregunta = sequelize.define('pregunta', {
        titulo: DataTypes.STRING,
        external_id: DataTypes.UUID,
        descripcion: DataTypes.TEXT,
        etiquetas: DataTypes.STRING,
        numero_vistas: DataTypes.INTEGER,
        categoria: DataTypes.STRING
    }, {freezeTableName: true});
    pregunta.associate = function (models) {
        pregunta.belongsTo(models.usuario, {foreignKey: 'id_usuario'});
        pregunta.hasMany(models.respuesta, {foreignKey: 'id_pregunta', as: "respuesta"});
        pregunta.hasMany(models.puntuacion, {foreignKey: 'id_pregunta', as: "pregunta_puntuacion"});
    };
    return pregunta;
};
