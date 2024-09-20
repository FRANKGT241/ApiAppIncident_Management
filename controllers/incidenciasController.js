// controllers/incidenciaController.js
import Incidencia from '../models/incidencia.js';
import Fotografia from '../models/fotografia_incidencia.js';
import sequelize from '../database.js';
import fs from 'fs-extra';
import path from 'path';

// Función para crear una incidencia
export const crearIncidencia = async (req, res) => {
    const { id_edificio, descripcion_incidencia, fecha_incidencia, id_usuario, tipo_incidencia_id_incidencia } = req.body;
    const fotografias = req.files; // Imágenes cargadas por Multer

    // Validación básica
    if (!id_edificio || !descripcion_incidencia || !fecha_incidencia || !id_usuario || !tipo_incidencia_id_incidencia) {
        // Eliminar archivos cargados si la validación falla
        if (fotografias && fotografias.length > 0) {
            fotografias.forEach(file => fs.unlink(file.path));
        }
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    // 'fotografias' debe ser un array de archivos
    if (!fotografias || fotografias.length === 0) {
        return res.status(400).json({ error: 'Se requiere al menos una fotografía.' });
    }

    const transaction = await sequelize.transaction();

    try {
        // Crear la incidencia
        const nuevaIncidencia = await Incidencia.create({
            id_edificio,
            descripcion_incidencia,
            fecha_incidencia,
            id_usuario,
            tipo_incidencia_id_incidencia
        }, { transaction });

        // Crear las fotografías asociadas
        const fotografiasCreadas = await Promise.all(fotografias.map(async (file) => {
            const fotografia = await Fotografia.create({
                path_foto: file.path, // Almacenar la ruta del archivo
                fecha_incidencia: fecha_incidencia, // Puedes ajustar esto según tus necesidades
                id_incidencia: nuevaIncidencia.id_incidencia
            }, { transaction });

            return fotografia;
        }));

        await transaction.commit();

        // Preparar la respuesta
        const respuesta = {
            id_incidencia: nuevaIncidencia.id_incidencia,
            id_edificio: nuevaIncidencia.id_edificio,
            descripcion_incidencia: nuevaIncidencia.descripcion_incidencia,
            fecha_incidencia: nuevaIncidencia.fecha_incidencia,
            id_usuario: nuevaIncidencia.id_usuario,
            tipo_incidencia_id_incidencia: nuevaIncidencia.tipo_incidencia_id_incidencia,
            fotografias: await Promise.all(fotografiasCreadas.map(async (foto) => {
                // Leer el archivo y convertirlo a Base64
                const filePath = path.resolve(foto.path_foto);
                const fileData = await fs.readFile(filePath, { encoding: 'base64' });
                const fileExt = path.extname(foto.path_foto).substring(1).toLowerCase(); // Obtener la extensión sin el punto y en minúsculas
                const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' :
                                 fileExt === 'png' ? 'image/png' :
                                 fileExt === 'gif' ? 'image/gif' : 'application/octet-stream'; // Ajustar MIME type

                return {
                    id_fotografia: foto.id_fotografia,
                    foto: `data:${mimeType};base64,${fileData}`,
                    fecha_incidencia: foto.fecha_incidencia,
                    id_incidencia: foto.id_incidencia
                };
            }))
        };

        return res.status(201).json(respuesta);
    } catch (error) {
        await transaction.rollback();

        // Eliminar archivos cargados en caso de error
        if (fotografias && fotografias.length > 0) {
            fotografias.forEach(file => fs.unlink(file.path));
        }

        console.error('Error al crear la incidencia:', error);
        return res.status(500).json({ error: 'Error al crear la incidencia.' });
    }
};

// Función para obtener todas las incidencias
export const obtenerIncidencias = async (req, res) => {
    try {
        const incidencias = await Incidencia.findAll({
            include: [{
                model: Fotografia,
                as: 'fotografias_incidencia',
            }]
        });

        // Convertir cada incidencia y sus fotografías
        const respuesta = await Promise.all(incidencias.map(async (incidencia) => {
            const fotografias = await Promise.all(incidencia.fotografias_incidencia.map(async (foto) => {
                const filePath = path.resolve(foto.path_foto);
                // Verificar si el archivo existe
                const exists = await fs.pathExists(filePath);
                if (!exists) {
                    return {
                        id_fotografia: foto.id_fotografia,
                        foto: null, // Indicar que la imagen no está disponible
                        fecha_incidencia: foto.fecha_incidencia,
                        id_incidencia: foto.id_incidencia
                    };
                }

                const fileData = await fs.readFile(filePath, { encoding: 'base64' });
                const fileExt = path.extname(foto.path_foto).substring(1).toLowerCase();
                const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' :
                                 fileExt === 'png' ? 'image/png' :
                                 fileExt === 'gif' ? 'image/gif' : 'application/octet-stream';

                return {
                    id_fotografia: foto.id_fotografia,
                    foto: `data:${mimeType};base64,${fileData}`,
                    fecha_incidencia: foto.fecha_incidencia,
                    id_incidencia: foto.id_incidencia
                };
            }));

            return {
                id_incidencia: incidencia.id_incidencia,
                id_edificio: incidencia.id_edificio,
                descripcion_incidencia: incidencia.descripcion_incidencia,
                fecha_incidencia: incidencia.fecha_incidencia,
                id_usuario: incidencia.id_usuario,
                tipo_incidencia_id_incidencia: incidencia.tipo_incidencia_id_incidencia,
                fotografias: fotografias
            };
        }));

        return res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error al obtener las incidencias:', error);
        return res.status(500).json({ error: 'Error al obtener las incidencias.' });
    }
};

// Función para obtener una incidencia por ID
export const obtenerIncidenciaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const incidencia = await Incidencia.findByPk(id, {
            include: [{
                model: Fotografia,
                as: 'fotografias_incidencia',
            }]
        });

        if (!incidencia) {
            return res.status(404).json({ error: 'Incidencia no encontrada.' });
        }

        const fotografias = await Promise.all(incidencia.fotografias_incidencia.map(async (foto) => {
            const filePath = path.resolve(foto.path_foto);
            // Verificar si el archivo existe
            const exists = await fs.pathExists(filePath);
            if (!exists) {
                return {
                    id_fotografia: foto.id_fotografia,
                    foto: null,
                    fecha_incidencia: foto.fecha_incidencia,
                    id_incidencia: foto.id_incidencia
                };
            }

            const fileData = await fs.readFile(filePath, { encoding: 'base64' });
            const fileExt = path.extname(foto.path_foto).substring(1).toLowerCase();
            const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' :
                             fileExt === 'png' ? 'image/png' :
                             fileExt === 'gif' ? 'image/gif' : 'application/octet-stream';

            return {
                id_fotografia: foto.id_fotografia,
                foto: `data:${mimeType};base64,${fileData}`,
                fecha_incidencia: foto.fecha_incidencia,
                id_incidencia: foto.id_incidencia
            };
        }));

        const respuesta = {
            id_incidencia: incidencia.id_incidencia,
            id_edificio: incidencia.id_edificio,
            descripcion_incidencia: incidencia.descripcion_incidencia,
            fecha_incidencia: incidencia.fecha_incidencia,
            id_usuario: incidencia.id_usuario,
            tipo_incidencia_id_incidencia: incidencia.tipo_incidencia_id_incidencia,
            fotografias: fotografias
        };

        return res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error al obtener la incidencia:', error);
        return res.status(500).json({ error: 'Error al obtener la incidencia.' });
    }
};

// Función para actualizar una incidencia
export const actualizarIncidencia = async (req, res) => {
    const { id } = req.params;
    const { id_edificio, descripcion_incidencia, fecha_incidencia, id_usuario, tipo_incidencia_id_incidencia, eliminar_fotografias } = req.body;
    const nuevasFotografias = req.files; // Nuevas imágenes cargadas por Multer

    const transaction = await sequelize.transaction();

    try {
        // Buscar la incidencia a actualizar
        const incidencia = await Incidencia.findByPk(id, {
            include: [{
                model: Fotografia,
                as: 'fotografias_incidencia',
            }]
        });

        if (!incidencia) {
            // Eliminar nuevas imágenes cargadas si la incidencia no existe
            if (nuevasFotografias && nuevasFotografias.length > 0) {
                nuevasFotografias.forEach(file => fs.unlink(file.path));
            }
            return res.status(404).json({ error: 'Incidencia no encontrada.' });
        }

        // Actualizar los campos de la incidencia
        incidencia.id_edificio = id_edificio !== undefined ? id_edificio : incidencia.id_edificio;
        incidencia.descripcion_incidencia = descripcion_incidencia !== undefined ? descripcion_incidencia : incidencia.descripcion_incidencia;
        incidencia.fecha_incidencia = fecha_incidencia !== undefined ? fecha_incidencia : incidencia.fecha_incidencia;
        incidencia.id_usuario = id_usuario !== undefined ? id_usuario : incidencia.id_usuario;
        incidencia.tipo_incidencia_id_incidencia = tipo_incidencia_id_incidencia !== undefined ? tipo_incidencia_id_incidencia : incidencia.tipo_incidencia_id_incidencia;

        await incidencia.save({ transaction });

        // Eliminar fotografías si se especifica
        if (eliminar_fotografias && Array.isArray(eliminar_fotografias)) {
            for (const fotoId of eliminar_fotografias) {
                const foto = await Fotografia.findOne({ where: { id_fotografia: fotoId, id_incidencia: id } });
                if (foto) {
                    // Eliminar el archivo físico
                    const filePath = path.resolve(foto.path_foto);
                    const exists = await fs.pathExists(filePath);
                    if (exists) {
                        await fs.unlink(filePath);
                    }
                    // Eliminar el registro de la base de datos
                    await foto.destroy({ transaction });
                }
            }
        }

        // Agregar nuevas fotografías si se cargaron
        let fotografiasCreadas = [];
        if (nuevasFotografias && nuevasFotografias.length > 0) {
            fotografiasCreadas = await Promise.all(nuevasFotografias.map(async (file) => {
                const fotografia = await Fotografia.create({
                    path_foto: file.path,
                    fecha_incidencia: fecha_incidencia || new Date(),
                    id_incidencia: id
                }, { transaction });

                return fotografia;
            }));
        }

        await transaction.commit();

        // Preparar la respuesta actualizada
        const todasFotografias = await Fotografia.findAll({ where: { id_incidencia: id } });

        const fotografias = await Promise.all(todasFotografias.map(async (foto) => {
            const filePath = path.resolve(foto.path_foto);
            // Verificar si el archivo existe
            const exists = await fs.pathExists(filePath);
            if (!exists) {
                return {
                    id_fotografia: foto.id_fotografia,
                    foto: null,
                    fecha_incidencia: foto.fecha_incidencia,
                    id_incidencia: foto.id_incidencia
                };
            }

            const fileData = await fs.readFile(filePath, { encoding: 'base64' });
            const fileExt = path.extname(foto.path_foto).substring(1).toLowerCase();
            const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' :
                             fileExt === 'png' ? 'image/png' :
                             fileExt === 'gif' ? 'image/gif' : 'application/octet-stream';

            return {
                id_fotografia: foto.id_fotografia,
                foto: `data:${mimeType};base64,${fileData}`,
                fecha_incidencia: foto.fecha_incidencia,
                id_incidencia: foto.id_incidencia
            };
        }));

        const respuesta = {
            id_incidencia: incidencia.id_incidencia,
            id_edificio: incidencia.id_edificio,
            descripcion_incidencia: incidencia.descripcion_incidencia,
            fecha_incidencia: incidencia.fecha_incidencia,
            id_usuario: incidencia.id_usuario,
            tipo_incidencia_id_incidencia: incidencia.tipo_incidencia_id_incidencia,
            fotografias: fotografias
        };

        return res.status(200).json(respuesta);
    } catch (error) {
        await transaction.rollback();

        // Eliminar nuevas imágenes cargadas en caso de error
        if (nuevasFotografias && nuevasFotografias.length > 0) {
            nuevasFotografias.forEach(file => fs.unlink(file.path));
        }

        console.error('Error al actualizar la incidencia:', error);
        return res.status(500).json({ error: 'Error al actualizar la incidencia.' });
    }
};

// Función para eliminar una incidencia
export const eliminarIncidencia = async (req, res) => {
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const incidencia = await Incidencia.findByPk(id, {
            include: [{
                model: Fotografia,
                as: 'fotografias_incidencia',
            }]
        });

        if (!incidencia) {
            return res.status(404).json({ error: 'Incidencia no encontrada.' });
        }

        // Eliminar todas las fotografías físicas asociadas
        for (const foto of incidencia.fotografias_incidencia) {
            const filePath = path.resolve(foto.path_foto);
            const exists = await fs.pathExists(filePath);
            if (exists) {
                await fs.unlink(filePath);
            }
        }

        // Eliminar la incidencia (esto eliminará las fotografías en la base de datos debido a CASCADE)
        await incidencia.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Incidencia y fotografías eliminadas correctamente.' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al eliminar la incidencia:', error);
        return res.status(500).json({ error: 'Error al eliminar la incidencia.' });
    }
};
