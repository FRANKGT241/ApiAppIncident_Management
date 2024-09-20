import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import edificioRoutes from './routes/edificioRoutes.js';
import tipoMantenimientoRoutes from './routes/tipoMantenimientoRoutes.js';
import tipoIncidenciaRoutes from './routes/tipoIncidenciaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuariosRoutes.js';
import incidenciaRoutes from './routes/incidenciasRoutes.js'; 
import MantenimientoRoutes from './routes/mantenimientoRoutes.js'; 
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/edificios', edificioRoutes);
app.use('/api/tipos-mantenimiento', tipoMantenimientoRoutes);
app.use('/api/tipos-incidencia', tipoIncidenciaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/incidencias', incidenciaRoutes);
app.use('/api/mantenimiento', MantenimientoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
