'use strict';

module.exports = (sequelize, DataTypes) => {
    const notificacion = sequelize.define('notificacion', {
        titulo: DataTypes.STRING,
        external_id: DataTypes.UUID,
        descripcion: DataTypes.TEXT
    }, {freezeTableName: true});
    notificacion.associate = function (models) {
        notificacion.belongsTo(models.pregunta, {foreingKey: 'id_pregunta'});        
    };
    return notificacion;
};
