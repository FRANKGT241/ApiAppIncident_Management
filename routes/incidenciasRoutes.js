// routes/incidencia.js
import express from 'express';
import {
    crearIncidencia,
    obtenerIncidencias,
    obtenerIncidenciaPorId,
    actualizarIncidencia,
    eliminarIncidencia
} from '../controllers/incidenciasController.js';
import upload from '../config/multer.js'; // Importa la configuración de multer

const router = express.Router();

// Ruta para crear una nueva incidencia y subir imágenes
// 'fotografias' es el nombre del campo que contendrá las imágenes
router.post('/', upload.array('fotografias', 10), crearIncidencia);

// Rutas existentes
router.get('/', obtenerIncidencias);
router.get('/:id', obtenerIncidenciaPorId);
router.put('/:id', upload.array('fotografias', 10), actualizarIncidencia); // Si deseas permitir actualizar imágenes
router.delete('/:id', eliminarIncidencia);

export default router;
