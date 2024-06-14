import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

//const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const galeriaPath = path.join(__dirname, '../galeria');
const modelsPath = path.join(__dirname, '../models');


// Aquí traigo el callback de las rutas, los meto en constantes, y los exporto
export const home = (req, res) => res.render('home', {title: "Home"});

export const captura = (req, res) => res.render('captura', {title: "Captura de imagen"});

export const galeria = (req, res) => {
    fs.readdir(galeriaPath, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de galería:', err);
            return res.status(500).send('Error al leer la carpeta de galería');
        }
        
        // Obtener la información de los archivos para ordenar por fecha de creación
        const fileInfos = files.map(file => {
            const filePath = path.join(galeriaPath, file);
            const stats = fs.statSync(filePath);
            return { file, ctime: stats.ctime };
        });

        // Ordenar los archivos por fecha de creación en orden descendente
        fileInfos.sort((a, b) => b.ctime - a.ctime);

        // Obtener los nombres de los archivos ordenados
        const sortedFiles = fileInfos.map(info => info.file);

        res.render('galeria', { title: "Galería", imagenes: sortedFiles });
    });
};

export const guardarImagen = async (req, res) => {
    const { image } = req.body;

    // Decodificar la imagen
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const fileName = `imagen_${Date.now()}.png`;
    const filePath = path.join(galeriaPath, fileName);

    try {
        // Guardar la imagen en la carpeta Galería
        await fs.promises.writeFile(filePath, base64Data, 'base64');
        res.json({ message: 'Imagen guardada con éxito', path: filePath });
    } catch (error) {
        console.error('Error al guardar la imagen:', error);
        res.status(500).json({ error: 'Error al guardar la imagen' });
    }
};

export const modeloEntrenado = (req, res) => {
    const modelData = req.body.model;

    // Guardar el modelo en un archivo JSON
    fs.writeFileSync(path.join(modelsPath, 'modeloEntrenado.json'), JSON.stringify(modelData, null, 2));

    res.status(200).json({ message: 'Modelo guardado exitosamente' });
};

// Función para procesar la imagen
const procesarImagen = async (imageBuffer) => {
    const resizedImageBuffer = await sharp(imageBuffer)
        .resize(32, 32)
        .greyscale()
        .raw()
        .toBuffer();

    return Array.from(resizedImageBuffer).map(value => value / 255);
};
//Descripción de la imagen
export const describirImagen = async (req, res) => {
    try {
        let { imagePath } = req.body;

        // Convertir la URL a una ruta del sistema de archivos
        const urlPrefix = 'http://localhost:3000';
        if (imagePath.startsWith(urlPrefix)) {
            imagePath = imagePath.replace(urlPrefix, '');
        }

        const absolutePath = path.join(__dirname, '..', imagePath);
        console.log('absolutePath:', absolutePath);

        // Leer el archivo de imagen
        const imageBuffer = fs.readFileSync(absolutePath);

        // Procesar la imagen
        const processedImage = await procesarImagen(imageBuffer);

        res.json({ processedImage });
    } catch (error) {
        console.error('Error al describir la imagen:', error);
        res.status(500).json({ error: 'Error al describir la imagen' });
    }
};
//Vista de la galería a la descripción
export const vistaDescribir = (req, res) => {
    const { imagePath } = req.query;
    res.render('descripcion', { imagePath });
};
