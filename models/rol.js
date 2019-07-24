'use strict';
module.exports = (sequelize, DataTypes) => {
  const rol = sequelize.define('rol', {
    nombre: DataTypes.STRING
  }, {freezeTableName: true});
  rol.associate = function(models) {
    rol.hasMany(models.links,{foreignKey:'id_rol',as: 'rol_links'});
  rol.hasMany(models.cuenta,{foreignKey:'id_rol',as: 'rol_cuenta'});
  };
  return rol;
};