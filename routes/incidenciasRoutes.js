// routes/incidencia.js
import express from 'express';
import {
    crearIncidencia,
    obtenerIncidencias
} from '../controllers/IncidenciasController.js';
import upload from '../config/multer.js'; 

const router = express.Router();

router.post('/', upload.array('fotografias', 10), crearIncidencia);
router.get('/', obtenerIncidencias);


export default router;
