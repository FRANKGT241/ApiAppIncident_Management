import Edificio from "../models/edificioModel.js";

export const crearEdificio = async (req, res) => {
    try {
        const { nombre_edificio, descripcion, latitud, longitud } = req.body;
        const nuevoEdificio = await Edificio.create({
            nombre_edificio,
            descripcion,
            latitud,
            longitud
        });
        res.status(201).json(nuevoEdificio);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el edificio.', error: error.message });
    }
};

export const obtenerEdificios = async (req, res) => {
    try {
        const edificios = await Edificio.findAll();
        res.status(200).json(edificios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los edificios.', error: error.message });
    }
};

export const obtenerEdificioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const edificio = await Edificio.findByPk(id);
        if (edificio) {
            res.status(200).json(edificio);
        } else {
            res.status(404).json({ mensaje: 'Edificio no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el edificio.', error: error.message });
    }
};

export const actualizarEdificio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_edificio, descripcion, latitud, longitud } = req.body;

        const edificio = await Edificio.findByPk(id);
        if (edificio) {
            edificio.nombre_edificio = nombre_edificio || edificio.nombre_edificio;
            edificio.descripcion = descripcion || edificio.descripcion;
            edificio.latitud = latitud || edificio.latitud;
            edificio.longitud = longitud || edificio.longitud;

            await edificio.save();
            res.status(200).json(edificio);
        } else {
            res.status(404).json({ mensaje: 'Edificio no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el edificio.', error: error.message });
    }
};


export const eliminarEdificio = async (req, res) => {
    try {
        const { id } = req.params;
        const edificio = await Edificio.findByPk(id);
        if (edificio) {
            await edificio.destroy();
            res.status(200).json({ mensaje: 'Edificio eliminado exitosamente.' });
        } else {
            res.status(404).json({ mensaje: 'Edificio no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el edificio.', error: error.message });
    }
};
