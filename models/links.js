'use strict';
module.exports = (sequelize, DataTypes) => {
    const links = sequelize.define('links', {
        nombre: DataTypes.STRING
    }, {freezeTableName: true});
    links.associate = function (models) {
        links.belongsTo(models.grupos, {foreignKey: 'id_grupo'});
        links.belongsTo(models.rol, {foreignKey: 'id_rol'});
    };
    return links;
};