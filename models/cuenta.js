'use strict';
module.exports = (sequelize, DataTypes) => {
  const cuenta = sequelize.define('cuenta', {
    username: DataTypes.STRING,
    clave: DataTypes.STRING
  }, {});
  cuenta.associate = function(models) {
    // associations can be defined here
  };
  return cuenta;
};