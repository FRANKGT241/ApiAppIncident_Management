import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const TipoMantenimiento = sequelize.define('tipo_mantenimiento', {
    id_tipo_mantenimiento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_tipo_mantenimiento: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'tipo_mantenimiento'
});

export default TipoMantenimiento;
