// routes/incidencia.js
import express from 'express';
import {
    crearmantenimiento,
    obtenermantenimientos
} from '../controllers/mantenimineotController.js';
import upload from '../config/multer.js'; 

const router = express.Router();

router.post('/', upload.array('fotografias', 10), crearmantenimiento);
router.get('/', obtenermantenimientos);


export default router;
