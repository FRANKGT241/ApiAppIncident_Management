import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
    tableName: 'usuario'
});

export default Usuario;
