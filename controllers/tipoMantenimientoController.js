import TipoMantenimiento from '../models/tipoMantenimientoModel.js';


export const crearTipoMantenimiento = async (req, res) => {
    try {
        const { nombre_tipo_mantenimiento } = req.body;
        const nuevoTipo = await TipoMantenimiento.create({
            nombre_tipo_mantenimiento
        });
        res.status(201).json(nuevoTipo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el tipo de mantenimiento.', error: error.message });
    }
};


export const obtenerTiposMantenimiento = async (req, res) => {
    try {
        const tipos = await TipoMantenimiento.findAll();
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los tipos de mantenimiento.', error: error.message });
    }
};

export const obtenerTipoMantenimientoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await TipoMantenimiento.findByPk(id);
        if (tipo) {
            res.status(200).json(tipo);
        } else {
            res.status(404).json({ mensaje: 'Tipo de mantenimiento no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el tipo de mantenimiento.', error: error.message });
    }
};

export const actualizarTipoMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_tipo_mantenimiento } = req.body;

        const tipo = await TipoMantenimiento.findByPk(id);
        if (tipo) {
            tipo.nombre_tipo_mantenimiento = nombre_tipo_mantenimiento || tipo.nombre_tipo_mantenimiento;
            await tipo.save();
            res.status(200).json(tipo);
        } else {
            res.status(404).json({ mensaje: 'Tipo de mantenimiento no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el tipo de mantenimiento.', error: error.message });
    }
};


export const eliminarTipoMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await TipoMantenimiento.findByPk(id);
        if (tipo) {
            await tipo.destroy();
            res.status(200).json({ mensaje: 'Tipo de mantenimiento eliminado exitosamente.' });
        } else {
            res.status(404).json({ mensaje: 'Tipo de mantenimiento no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el tipo de mantenimiento.', error: error.message });
    }
};
