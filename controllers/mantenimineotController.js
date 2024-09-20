// controllers/mantenimientoController.js
import Mantenimiento from '../models/mantenimientoMode.js';
import FotografiaMantenimiento from '../models/fotografiaMantenimiento.js';
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
 * Crear una nueva mantenimiento con múltiples fotografías.
 */
export const crearmantenimiento = async (req, res) => {
    const { id_tipo_mantenimiento, id_edificio, descripcion_mantenimiento, fecha_mantenimiento, id_usuario, fotografias } = req.body;
    console.log(req.body);

    // Validaciones de campos requeridos
    if (!id_edificio || !descripcion_mantenimiento || !fecha_mantenimiento || !id_usuario || !id_tipo_mantenimiento) {
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
        const fotosJSON = []; // Arreglo para almacenar { foto: filename, fecha_fotografia: date }

        for (const fotoData of fotografias) {
            // Validar que cada fotografía contenga 'foto' y 'fecha_mantenimiento'
            if (!fotoData || !fotoData.foto || !fotoData.fecha_mantenimiento) {
                throw new Error('Cada fotografía debe contener "foto" y "fecha_mantenimiento".');
            }

            // Determinar la extensión de la imagen
            let extension = 'png'; // Valor por defecto
            if (fotoData.foto.startsWith('data:image/jpeg')) {
                extension = 'jpeg';
            } else if (fotoData.foto.startsWith('data:image/png')) {
                extension = 'png';
            } // Puedes agregar más condiciones según los tipos de imagen que soportes

            // Extraer la cadena Base64 sin el prefijo
            const base64Data = fotoData.foto.split(',')[1];

            // Guardar la imagen en el sistema de archivos y obtener el nombre del archivo
            const filename = guardarImagen(base64Data, extension);

            // Agregar al arreglo JSON
            fotosJSON.push({
                foto: filename,
                fecha_fotografia: new Date(fotoData.fecha_mantenimiento) // Usar la fecha proporcionada
            });
        }

        // Crear el registro de mantenimiento
        const mantenimiento = await Mantenimiento.create({
            id_tipo_mantenimiento,
            id_edificio,
            descripcion_mantenimiento,
            fecha_mantenimiento,
            id_usuario,
        }, { transaction });

        // Crear un único registro en fotografia_mantenimiento con todas las fotografías
        await FotografiaMantenimiento.create({
            foto: fotosJSON, // Almacena el arreglo de fotos en el campo JSON
            fecha_fotografia: new Date(), // Puedes ajustar esta fecha según tu lógica
            id_mantenimiento: mantenimiento.id_mantenimiento
        }, { transaction });

        // Confirmar la transacción
        await transaction.commit();

        // Responder con éxito
        return res.status(201).json({ message: 'Mantenimiento creado exitosamente.' });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Error al crear el mantenimiento:', error);
        return res.status(500).json({ error: 'Error al crear el mantenimiento.' });
    }
};



/**
 * Obtener todas las mantenimientos junto con sus fotografías en base64.
 */
export const obtenermantenimientos = async (req, res) => {
    try {
        // Obtener todas las mantenimientos con sus fotografías
        const mantenimientos = await Mantenimiento.findAll();

        // Mapear las mantenimientos para incluir las fotografías en base64
        const resultados = mantenimientos.map(mantenimiento => ({
            id_mantenimiento: mantenimiento.id_mantenimiento,
            id_edificio: mantenimiento.id_edificio,
            descripcion_mantenimiento: mantenimiento.descripcion_mantenimiento,
            fecha_mantenimiento: mantenimiento.fecha_mantenimiento,
            id_usuario: mantenimiento.id_usuario,
            tipo_mantenimiento_id_mantenimiento: mantenimiento.tipo_mantenimiento_id_mantenimiento
        }));

        return res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener las mantenimientos:', error);
        return res.status(500).json({ error: 'Error al obtener las mantenimientos.' });
    }
};



