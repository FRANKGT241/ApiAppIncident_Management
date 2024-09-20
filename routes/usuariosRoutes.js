// routes/usuarioRoutes.js
import express from 'express';
import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);


router.delete('/:id', eliminarUsuario);

export default router;
