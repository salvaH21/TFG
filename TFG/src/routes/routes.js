import {Router} from 'express';
//Importo los callbacks de controllers
import {home, captura, galeria, guardarImagen, modeloEntrenado, describirImagen, vistaDescribir} from '../controllers/controllers.js';


const router = Router();


router.get('/', home);

router.get('/captura', captura);
router.get('/galeria', galeria);
router.post('/guardar-imagen', guardarImagen);
router.post('/modeloEntrenado', modeloEntrenado);
router.post('/describirImagen', describirImagen);
router.get('/vistaDescribir', vistaDescribir);


//Lo exporto para poder utilizarlo en cualquier otro archivo de la aplicación que lo necesite
export default router;