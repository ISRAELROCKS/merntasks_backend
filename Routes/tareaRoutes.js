import express  from 'express';//para definir el rauting hay que importar expres siempre en las rutas
import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
} from '../Controllers/tareaController.js';
import checkAuth from '../middleware/checkAuth.js';

//se define el router 
const router = express.Router();

router.post('/',checkAuth,agregarTarea);
router.
    route('/:id')
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, actualizarTarea)
    .delete(checkAuth,eliminarTarea)

router.post ('/estado/:id',checkAuth, cambiarEstado);
    

export default router;