import mongoose from 'mongoose';
import {MONGODB_URI} from '../config.js';

const conexionDB = async () => {
    try {
        const conexionMongoose = await mongoose.connect(MONGODB_URI, {});
        console.log(`MongoDB Conectado: ${conexionMongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Detiene la aplicación en caso de error
    }
};

export default conexionDB;