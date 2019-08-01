'use strict';

module.exports = (sequelize, DataTypes) => {
    const reportes = sequelize.define('reportes', {
        descripcion: DataTypes.STRING,
        motivo: DataTypes.STRING,
        external_id: DataTypes.UUID
    }, {freezeTableName: true});
    reportes.associate = function (models) {
        
    };
    return reportes;
};
