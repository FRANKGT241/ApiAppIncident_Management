import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Incidencia = sequelize.define('incidencia', {
    id_incidencia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_fotografia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_edificio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion_incidencia: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_incidencia: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo_incidencia_id_incidencia: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'incidencias'
});

export default Incidencia;
