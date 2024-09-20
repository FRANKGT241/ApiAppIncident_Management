// controllers/usuarioController.js
import Usuario from '../models/usuarioMode.js';
import bcrypt from 'bcrypt';

/**
 * Crear un nuevo usuario
 */
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, contraseña, nombre_usuario } = req.body;

        // Validar que todos los campos necesarios estén presentes
        if (!nombre || !apellido || !contraseña || !nombre_usuario) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        // Verificar si el nombre de usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { nombre_usuario } });
        if (usuarioExistente) {
            return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        // Crear el usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            contraseña: hashedPassword,
            nombre_usuario
        });

        // Retornar el usuario creado sin la contraseña
        const { contraseña: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

        res.status(201).json(usuarioSinPassword);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el usuario.', error: error.message });
    }
};

/**
 * Obtener todos los usuarios
 */
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['contraseña'] } // Excluir la contraseña de la respuesta
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios.', error: error.message });
    }
};

/**
 * Obtener un usuario por ID
 */
export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['contraseña'] }
        });
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario.', error: error.message });
    }
};

/**
 * Actualizar un usuario por ID
 */
export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, contraseña, nombre_usuario } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (usuario) {
            // Si se está actualizando el nombre de usuario, verificar si ya existe
            if (nombre_usuario && nombre_usuario !== usuario.nombre_usuario) {
                const usuarioExistente = await Usuario.findOne({ where: { nombre_usuario } });
                if (usuarioExistente) {
                    return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
                }
                usuario.nombre_usuario = nombre_usuario;
            }

            if (nombre) usuario.nombre = nombre;
            if (apellido) usuario.apellido = apellido;

            if (contraseña) {
                const saltRounds = 10;
                usuario.contraseña = await bcrypt.hash(contraseña, saltRounds);
            }

            await usuario.save();

            // Retornar el usuario actualizado sin la contraseña
            const { contraseña: _, ...usuarioSinPassword } = usuario.toJSON();

            res.status(200).json(usuarioSinPassword);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el usuario.', error: error.message });
    }
};

/**
 * Eliminar un usuario por ID
 */
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (usuario) {
            await usuario.destroy();
            res.status(200).json({ mensaje: 'Usuario eliminado exitosamente.' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario.', error: error.message });
    }
};
