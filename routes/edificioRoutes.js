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


router.post('/', crearEdificio);

router.get('/', obtenerEdificios);

router.get('/:id', obtenerEdificioPorId);

router.put('/:id', actualizarEdificio);

router.delete('/:id', eliminarEdificio);

export default router;
