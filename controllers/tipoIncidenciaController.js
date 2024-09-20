import TipoIncidencia from '../models/tipoInicidenciaModel.js';


export const crearTipoIncidencia = async (req, res) => {
    try {
        const { nombre_incidencia } = req.body;
        const nuevoTipo = await TipoIncidencia.create({
            nombre_incidencia
        });
        res.status(201).json(nuevoTipo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el tipo de incidencia.', error: error.message });
    }
};


export const obtenerTiposIncidencia = async (req, res) => {
    try {
        const tipos = await TipoIncidencia.findAll();
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los tipos de incidencia.', error: error.message });
    }
};


export const obtenerTipoIncidenciaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await TipoIncidencia.findByPk(id);
        if (tipo) {
            res.status(200).json(tipo);
        } else {
            res.status(404).json({ mensaje: 'Tipo de incidencia no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el tipo de incidencia.', error: error.message });
    }
};


export const actualizarTipoIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_incidencia } = req.body;

        const tipo = await TipoIncidencia.findByPk(id);
        if (tipo) {
            tipo.nombre_incidencia = nombre_incidencia || tipo.nombre_incidencia;
            await tipo.save();
            res.status(200).json(tipo);
        } else {
            res.status(404).json({ mensaje: 'Tipo de incidencia no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el tipo de incidencia.', error: error.message });
    }
};


export const eliminarTipoIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await TipoIncidencia.findByPk(id);
        if (tipo) {
            await tipo.destroy();
            res.status(200).json({ mensaje: 'Tipo de incidencia eliminado exitosamente.' });
        } else {
            res.status(404).json({ mensaje: 'Tipo de incidencia no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el tipo de incidencia.', error: error.message });
    }
};
