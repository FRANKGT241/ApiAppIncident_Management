// controllers/incidenciaController.js
import Incidencia from '../models/incidenciasMode.js';
import Fotografia from '../models/fotografiaIncidenciaModel.js';
import sequelize from '../database.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Función auxiliar para guardar una imagen en el sistema de archivos.
 * Recibe una cadena base64 y retorna el nombre del archivo guardado.
 */
const guardarImagen = (base64String, extension = 'png') => {
    // Decodificar la cadena base64
    const buffer = Buffer.from(base64String, 'base64');

    // Generar un nombre único para el archivo
    const filename = `${uuidv4()}.${extension}`; // Ajusta la extensión según el tipo de imagen

    // Ruta completa donde se guardará la imagen
    const filepath = path.join(process.cwd(), 'src', 'images', filename); // Asegúrate de que esta ruta exista

    // Guardar el archivo en el sistema de archivos
    fs.writeFileSync(filepath, buffer);

    return filename;
};

/**
 * Crear una nueva incidencia con múltiples fotografías.
 */
export const crearIncidencia = async (req, res) => {
    const { id_edificio, descripcion_incidencia, fecha_incidencia, id_usuario, tipo_incidencia_id_incidencia, fotografias } = req.body;

    // Validaciones de campos requeridos
    if (!id_edificio || !descripcion_incidencia || !fecha_incidencia || !id_usuario || !tipo_incidencia_id_incidencia) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    // Validar que 'fotografias' sea un array y contenga al menos una imagen
    if (!Array.isArray(fotografias) || fotografias.length === 0) {
        return res.status(400).json({ error: 'Se requiere al menos una fotografía.' });
    }

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        // Procesar y guardar todas las fotografías
        const fotosJSON = []; // Arreglo para almacenar { foto: filename, fecha_incidencia: date }

        for (const fotoData of fotografias) {
            // Validar que cada fotografía contenga 'foto' y 'fecha_incidencia'
            if (!fotoData || !fotoData.foto || !fotoData.fecha_incidencia) {
                throw new Error('Cada fotografía debe contener "foto" y "fecha_incidencia".');
            }

            // Opcional: Determinar la extensión de la imagen si es posible
            const extension = 'png'; // Puedes ajustar esto dinámicamente si conoces el tipo de imagen

            // Guardar la imagen en el sistema de archivos y obtener el nombre del archivo
            const filename = guardarImagen(fotoData.foto, extension);

            // Agregar al arreglo JSON
            fotosJSON.push({
                foto: filename
            });
        }

        // Crear un único registro en fotografia_incidencia con todas las fotografías
        const nuevaFotografia = await Fotografia.create({
            foto: fotosJSON // Puedes ajustar esta fecha según tu lógica
        }, { transaction });

        // Crear la incidencia asociándola con el id_fotografia
        await Incidencia.create({
            id_fotografia: nuevaFotografia.id_fotografia,
            id_edificio,
            descripcion_incidencia,
            fecha_incidencia,
            id_usuario,
            tipo_incidencia_id_incidencia
        }, { transaction });

        // Confirmar la transacción
        await transaction.commit();

        // Responder con éxito
        return res.status(201).json({ message: 'Incidencia creada exitosamente.' });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Error al crear la incidencia:', error);
        return res.status(500).json({ error: 'Error al crear la incidencia.' });
    }
};

/**
 * Obtener todas las incidencias junto con sus fotografías en base64.
 */
export const obtenerIncidencias = async (req, res) => {
    try {
        // Obtener todas las incidencias con sus fotografías
        const incidencias = await Incidencia.findAll();
        const fotos = await Fotografia.findOne({where:incidencias.id_fotografia})

        // Mapear las incidencias para incluir las fotografías en base64
        const resultados = incidencias.map(incidencia => ({
            id_incidencia: incidencia.id_incidencia,
            id_edificio: incidencia.id_edificio,
            id_fotografia: incidencia.id_fotografia,
            descripcion_incidencia: incidencia.descripcion_incidencia,
            fecha_incidencia: incidencia.fecha_incidencia,
            id_usuario: incidencia.id_usuario,
            tipo_incidencia_id_incidencia: incidencia.tipo_incidencia_id_incidencia,
            fotografias: fotos
        }));

        return res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener las incidencias:', error);
        return res.status(500).json({ error: 'Error al obtener las incidencias.' });
    }
};

/**
 * Obtener una incidencia específica por su ID junto con sus fotografías en base64.
 */
