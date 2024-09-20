// routes/tipoMantenimientoRoutes.js
import express from 'express';
import {
    crearTipoMantenimiento,
    obtenerTiposMantenimiento,
    obtenerTipoMantenimientoPorId,
    actualizarTipoMantenimiento,
    eliminarTipoMantenimiento
} from '../controllers/tipoMantenimientoController.js';

const router = express.Router();

// Ruta para crear un nuevo tipo de mantenimiento
router.post('/', crearTipoMantenimiento);

// Ruta para obtener todos los tipos de mantenimiento
router.get('/', obtenerTiposMantenimiento);

// Ruta para obtener un tipo de mantenimiento por ID
router.get('/:id', obtenerTipoMantenimientoPorId);

// Ruta para actualizar un tipo de mantenimiento por ID
router.put('/:id', actualizarTipoMantenimiento);

// Ruta para eliminar un tipo de mantenimiento por ID
router.delete('/:id', eliminarTipoMantenimiento);

export default router;
