import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const FotografiaMantenimiento = sequelize.define('fotografiaMantenimiento', {
    id_fotografia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    foto: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    fecha_fotografia: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_mantenimiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'fotografia_mantenimiento'
});

export default FotografiaMantenimiento;
