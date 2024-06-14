import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    data: Buffer,
    label: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya hashes duplicados en la base de datos
    },
});

const imagen = mongoose.model('Imagen', imageSchema);

export default imagen;

