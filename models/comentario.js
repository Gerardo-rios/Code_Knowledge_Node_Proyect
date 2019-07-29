'use strict';
module.exports = (sequelize, DataTypes) => {
    const comentario = sequelize.define('comentario', {
        external_id: DataTypes.UUID,
        descripcion: DataTypes.TEXT,
        external_id_usuario: DataTypes.STRING

    }, {freezeTableName: true});
    comentario.associate = function (models) {
        comentario.belongsTo(models.respuesta, {foreignKey: 'id_respuesta'});

    };
    return comentario;
};