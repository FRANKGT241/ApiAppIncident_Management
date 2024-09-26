// index.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import edificioRoutes from './routes/edificioRoutes.js';
import tipoMantenimientoRoutes from './routes/tipoMantenimientoRoutes.js';
import tipoIncidenciaRoutes from './routes/tipoIncidenciaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuariosRoutes.js';
import incidenciaRoutes from './routes/incidenciasRoutes.js'; 
import MantenimientoRoutes from './routes/mantenimientoRoutes.js'; 

// Configuración para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

// Configurar la ruta para servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'src', 'images')));

// Rutas de la API
app.use('/api/edificios', edificioRoutes);
app.use('/api/tipos-mantenimiento', tipoMantenimientoRoutes);
app.use('/api/tipos-incidencia', tipoIncidenciaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/incidencias', incidenciaRoutes);
app.use('/api/mantenimiento', MantenimientoRoutes);



// Sincronizar modelos con la base de datos y arrancar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

