'use strict';
module.exports = (sequelize, DataTypes) => {
  const grupos = sequelize.define('grupos', {
    nombre: DataTypes.STRING
  }, {freezeTableName: true});
  grupos.associate = function(models) {
    grupos.hasMany(models.links,{foreignKey:'id_grupo',as: 'grupos'});
  
  };
  return grupos;
};