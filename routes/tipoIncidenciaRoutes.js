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

router.post('/', crearTipoIncidencia);
router.get('/', obtenerTiposIncidencia);
router.get('/:id', obtenerTipoIncidenciaPorId);
router.put('/:id', actualizarTipoIncidencia);
router.delete('/:id', eliminarTipoIncidencia);

export default router;
