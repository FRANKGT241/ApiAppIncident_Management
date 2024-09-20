import Usuario from '../models/usuarioMode.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { nombre_usuario, contraseña } = req.body;

        const usuario = await Usuario.findOne({ where: { nombre_usuario } });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario o contraseña inválidos.' });
        }

        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!isMatch) {
            return res.status(400).json({ mensaje: 'Usuario o contraseña inválidos.' });
        }

        const payload = {
            id: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
    }
};

export const logout = (req, res) => {
    res.status(200).json({ mensaje: 'Logout exitoso.' });
};
