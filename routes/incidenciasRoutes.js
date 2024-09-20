// routes/incidencia.js
import express from 'express';
import { 
    crearIncidencia, 
    obtenerIncidencias, 
    obtenerIncidenciaPorId, 
    actualizarIncidencia, 
    eliminarIncidencia 
} from '../controllers/incidenciaController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Ruta para crear una incidencia con fotografías
router.post('/crear', upload.array('fotografias', 10), crearIncidencia);

// Ruta para obtener todas las incidencias
router.get('/', obtenerIncidencias);

// Ruta para obtener una incidencia específica por ID
router.get('/:id', obtenerIncidenciaPorId);

// Ruta para actualizar una incidencia (incluye la posibilidad de añadir nuevas fotografías)
router.put('/:id', upload.array('fotografias', 10), actualizarIncidencia);

// Ruta para eliminar una incidencia
router.delete('/:id', eliminarIncidencia);

export default router;
