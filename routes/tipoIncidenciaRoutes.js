// routes/tipoIncidenciaRoutes.js
import express from 'express';
import {
    crearTipoIncidencia,
    obtenerTiposIncidencia,
    obtenerTipoIncidenciaPorId,
    actualizarTipoIncidencia,
    eliminarTipoIncidencia
} from '../controllers/tipoIncidenciaController.js';

const router = express.Router();

// Ruta para crear un nuevo tipo de incidencia
router.post('/', crearTipoIncidencia);

// Ruta para obtener todos los tipos de incidencia
router.get('/', obtenerTiposIncidencia);

// Ruta para obtener un tipo de incidencia por ID
router.get('/:id', obtenerTipoIncidenciaPorId);

// Ruta para actualizar un tipo de incidencia por ID
router.put('/:id', actualizarTipoIncidencia);

// Ruta para eliminar un tipo de incidencia por ID
router.delete('/:id', eliminarTipoIncidencia);

export default router;
