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


router.post('/', crearTipoMantenimiento);

router.get('/', obtenerTiposMantenimiento);

router.get('/:id', obtenerTipoMantenimientoPorId);

router.put('/:id', actualizarTipoMantenimiento);

router.delete('/:id', eliminarTipoMantenimiento);

export default router;
