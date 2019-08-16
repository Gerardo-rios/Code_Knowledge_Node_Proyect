'use strict';
module.exports = (sequelize, DataTypes) => {
    const cuenta = sequelize.define('cuenta', {
       
        clave: DataTypes.STRING,
        tipo_cuenta: DataTypes.INTEGER(1),
        email: {type:DataTypes.STRING, unique:true},
        activa: DataTypes.BOOLEAN,
        ultima_sesion: {type: DataTypes.DATE, defaultValue: sequelize.literal('NOW()')}
    }, {freezeTableName: true});
    cuenta.associate = function (models) {
        cuenta.belongsTo(models.rol, {foreignKey: 'id_rol'});
        cuenta.belongsTo(models.usuario, {foreignKey: 'id_usuario'});
        cuenta.hasMany(models.reportes, {foreignKey: 'id_cuenta', as: "reportes"});
    };
    return cuenta;
};