import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const TipoIncidencia = sequelize.define('tipo_incidencia', {
    id_incidencia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_incidencia: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'tipo_incidencia'
});

export default TipoIncidencia;
