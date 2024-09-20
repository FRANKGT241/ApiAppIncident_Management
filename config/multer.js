// config/multer.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/images/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + path.extname(file.originalname); // Nombre único
        cb(null, uniqueName);
    }
});

// Filtro para asegurarse de que solo se suban imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('images/')) {
        cb(null, true);
    } else {
        cb(new Error('¡No es una imagen! Por favor, sube una imagen válida.'), false);
    }
};

// Configuración final de multer
const upload = multer({ storage, fileFilter });

export default upload;
