// routes/edificioRoutes.js
import express from 'express';
import {
    crearEdificio,
    obtenerEdificios,
    obtenerEdificioPorId,
    actualizarEdificio,
    eliminarEdificio
} from '../controllers/edificioController.js';

const router = express.Router();

// Ruta para crear un nuevo edificio
router.post('/', crearEdificio);

// Ruta para obtener todos los edificios
router.get('/', obtenerEdificios);

// Ruta para obtener un edificio por ID
router.get('/:id', obtenerEdificioPorId);

// Ruta para actualizar un edificio por ID
router.put('/:id', actualizarEdificio);

// Ruta para eliminar un edificio por ID
router.delete('/:id', eliminarEdificio);

export default router;
