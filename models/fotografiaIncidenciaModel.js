// models/fotografiaIncidenciaModel.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';

class Fotografia extends Model {}

Fotografia.init({
    id_fotografia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    foto: {
        type: DataTypes.JSON, 
        allowNull: true,
        defaultValue: []
    },
    fecha_incidencia: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Fotografia',
    tableName: 'fotografia_incidencia',
    timestamps: false
});

export default Fotografia;
