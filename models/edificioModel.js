import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Edificio = sequelize.define('edificio', {
    id_edificio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_edificio: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    latitud: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitud: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'edificios'
});

export default Edificio;
