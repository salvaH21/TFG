//Importo los módulos que necesito
import express from 'express';
//sirve para que me diga la ruta absoluta donde me encuentro
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
//Importo el enrutador
import indexRoutes from './routes/routes.js';
//Importo conexión base de datos
import conexionDB from './db/db.js';
//Importo la variable de entorno del puerto para el servidor
import {PORT} from './config.js';



const __dirname = dirname(fileURLToPath(import.meta.url));

//Conectar a MongoDB
conexionDB();

//Inicio express y lo almaceno en una constante
const app = express();

// Servir archivos estáticos desde la raíz, la carpeta public y galeria
app.use(express.static(join(__dirname)));
app.use(express.static(join(__dirname, 'public')));
app.use('/galeria', express.static(join(__dirname, 'galeria')));

// Configurar middleware para manejar datos del formulario
app.use(express.urlencoded({limit: '25mb', extended: true }));//Permite que el servidor procese datos de formularios HTML
app.use(express.json({limit: '25mb'}));//Permite que el servidor procese datos enviados en formato JSON

//Inicio un servidor
app.listen(PORT);
console.log('El servidor está escuchando por el puerto', PORT)

//Configurar motor de plantillas (ejs) (Para poder leer los archivos con extensión ejs)
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));


//Usar enrutador
app.use(indexRoutes);
