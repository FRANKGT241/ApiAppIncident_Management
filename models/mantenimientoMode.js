import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Mantenimiento = sequelize.define('mantenimiento', {
    id_mantenimiento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_tipo_mantenimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tiposMantenimiento', 
            key: 'id_tipo_mantenimiento'
        },
    },
    id_edificio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'edificios', 
            key: 'id_edificio'
        },
    },
    descripcion_mantenimiento: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_mantenimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios', 
            key: 'id_usuario'
        },
    }
}, {
    timestamps: false,
    tableName: 'mantenimiento'
});

export default Mantenimiento;
