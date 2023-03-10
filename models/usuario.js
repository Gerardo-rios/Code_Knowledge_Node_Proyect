'use strict';
module.exports = (sequelize, DataTypes) => {
    const usuario = sequelize.define('usuario', {
        username: {type:DataTypes.STRING(50), unique:true},
        nombres: DataTypes.STRING,
        external_id: DataTypes.UUID,
        apellidos: DataTypes.STRING,
        pais_origen: DataTypes.STRING,
        grado_estudio: DataTypes.STRING,
        imagen: DataTypes.STRING,
        descripcion: DataTypes.STRING

    }, {freezeTableName: true});
    usuario.associate = function (models) {
        usuario.hasOne(models.cuenta, {foreignKey: 'id_usuario', as: "cuenta"});
        usuario.hasMany(models.pregunta, {foreignKey: 'id_usuario', as: "usuario_pregunta"});
    };
    return usuario;
};
