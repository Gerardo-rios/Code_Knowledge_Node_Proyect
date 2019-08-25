'use strict';
module.exports = (sequelize, DataTypes) => {
    const pregunta = sequelize.define('pregunta', {
        titulo: DataTypes.STRING,
        external_id: DataTypes.UUID,
        descripcion: DataTypes.TEXT,
        etiquetas: DataTypes.STRING(600),
        numero_vistas: DataTypes.INTEGER

    }, {freezeTableName: true});
    pregunta.associate = function (models) {
        
        pregunta.belongsTo(models.categoria, {foreignKey: 'id_categoria'});
        pregunta.belongsTo(models.usuario, {foreignKey: 'id_usuario'});
        pregunta.hasMany(models.respuesta, {foreignKey: 'id_pregunta', as: "respuesta"});
       
    };
    return pregunta;
};
