'use strict';
module.exports = (sequelize, DataTypes) => {
    const categoria = sequelize.define('categoria', {
       
        nombre: DataTypes.STRING,
        external_id: DataTypes.UUID

    }, {freezeTableName: true});
    categoria.associate = function (models) {
        
        categoria.hasMany(models.pregunta, {foreignKey: 'id_categoria', as: 'categorium'});
    };
    return categoria;
};
