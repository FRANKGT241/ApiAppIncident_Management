import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Fotografia = sequelize.define('fotografia_incidencia', {
    id_fotografia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    foto: {
        type: DataTypes.JSON,
        allowNull: false
    },
    fecha_incidencia: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_incidencia: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'fotografia_incidencia'
});

export default Fotografia;
