import mongoose from 'mongoose';
import imagen from '../models/imagen.js';
import { MONGODB_URI } from '../config.js';
import sharp from 'sharp';
import fs from 'fs';

// Función para conectar a la base de datos
const conexionDB = async () => {
    try {
        const conexionMongoose = await mongoose.connect(MONGODB_URI, {});
        console.log(`MongoDB Conectado: ${conexionMongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Detiene la aplicación en caso de error
    }
};

// Array para las características de las imágenes de la base de datos
const datos = [];

// Función para recuperar y procesar las imágenes
const procesarImagenes = async () => {
    try {
        const imagenes = await imagen.find({});
        console.log(`Recuperadas ${imagenes.length} imágenes de la base de datos`);

        for (const img of imagenes) {
            const buffer = img.data;
            const features = await extraerCaracteristicas(buffer);
            if (features) {
                console.log(`Características de la imagen ${img._id}:`, features);
                // Agregar características al array
                datos.push({
                    id: img._id,
                    label: img.label,
                    features: features
                });
            }
        }

        // Escribir las características en un archivo JSON
        fs.writeFileSync('datos.json', JSON.stringify(datos));
        console.log(`Recuperadas ${imagenes.length} imágenes de la base de datos`);
        console.log('Datos de las imágenes guardados en datos.json');

    } catch (error) {
        console.error('Error al procesar las imágenes:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Función para extraer características de la imagen
const extraerCaracteristicas = async (buffer) => {
    try {
        // Convertir la imagen a escala de grises y redimensionar a 32x32 píxeles
        const resizedImageBuffer = await sharp(buffer)
            .resize(32, 32)
            .greyscale()
            .raw()
            .toBuffer();

        // Convertir el buffer redimensionado a una matriz de valores de píxeles
        const features = Array.from(resizedImageBuffer);
        return features;
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        return null;
    }
};

// Conectar a la base de datos y procesar las imágenes
conexionDB().then(() => {
    procesarImagenes();
});
