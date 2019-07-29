'use strict';
module.exports = (sequelize, DataTypes) => {
    const respuesta = sequelize.define('respuesta', {
        aceptada: DataTypes.BOOLEAN,
        external_id: DataTypes.UUID,
        descripcion: DataTypes.TEXT,
        external_id_usuario: DataTypes.STRING

    }, {freezeTableName: true});
    respuesta.associate = function (models) {
        respuesta.belongsTo(models.pregunta, {foreignKey: 'id_pregunta'});
        respuesta.hasMany(models.comentario, {foreignKey: 'id_comentario', as: "comentario"});


    };
    return respuesta;
};
