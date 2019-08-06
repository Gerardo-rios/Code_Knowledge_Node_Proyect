'use strict';

module.exports = (sequelize, DataTypes) => {
    const reportes = sequelize.define('reportes', {
        motivo: DataTypes.STRING,
        external_id: DataTypes.UUID,
        fecha_inicio: DataTypes.DATEONLY,
        fecha_fin: DataTypes.DATEONLY,
        estado: DataTypes.BOOLEAN,
        external: DataTypes.UUID
    }, {freezeTableName: true});
    reportes.associate = function (models) {
        reportes.belongsTo(models.cuenta, {foreingKey: 'id_cuenta'});
    };
    return reportes;
};
