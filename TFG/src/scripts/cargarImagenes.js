import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url'; // Importa fileURLToPath desde el módulo 'url'
import imagen from '../models/imagen.js';
import { MONGODB_URI } from '../config.js';

// Definir __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a la base de datos MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch((err) => {
    console.error('Error al conectar a MongoDB', err);
});

// Ruta a la carpeta de imágenes
const imagenesPath = path.join(__dirname, '../imagenes');

// Función para generar el hash de una imagen
const generarHash = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Función para cargar imágenes etiquetadas
const cargarImagenes = async () => {
    try {
        const etiquetas = fs.readdirSync(imagenesPath);
        for (const etiqueta of etiquetas) {
            const carpetaPath = path.join(imagenesPath, etiqueta);
            const archivos = fs.readdirSync(carpetaPath);

            for (const archivo of archivos) {
                const archivoPath = path.join(carpetaPath, archivo);
                const imagenData = fs.readFileSync(archivoPath);
                const buffer = Buffer.from(imagenData, 'base64');
                const hash = generarHash(buffer);

                // Verificar si la imagen ya existe en la base de datos
                const imagenExistente = await imagen.findOne({ hash });
                if (imagenExistente) {
                    console.log(`Imagen duplicada: ${archivo} con etiqueta: ${etiqueta}`);
                    continue;
                }

                const nuevaImagen = new imagen({ data: buffer, label: etiqueta, hash });
                await nuevaImagen.save();
                console.log(`Imagen guardada: ${archivo} con etiqueta: ${etiqueta}`);

                // Eliminar la imagen después de guardarla
                fs.unlinkSync(archivoPath);
                console.log(`Imagen eliminada: ${archivoPath}`);
            }
        }
        console.log('Todas las imágenes han sido cargadas y eliminadas.');
    } catch (error) {
        console.error('Error al cargar imágenes:', error);
    } finally {
        mongoose.connection.close();
    }
};

cargarImagenes();