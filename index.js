import express from 'express';
import bodyParser from 'body-parser';

import edificioRoutes from './routes/edificioRoutes.js';
import tipoMantenimientoRoutes from './routes/tipoMantenimientoRoutes.js';
import tipoIncidenciaRoutes from './routes/tipoIncidenciaRoutes.js';


const app = express();


app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/edificios', edificioRoutes);
app.use('/api/tipos-mantenimiento', tipoMantenimientoRoutes);
app.use('/api/tipos-incidencia', tipoIncidenciaRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
