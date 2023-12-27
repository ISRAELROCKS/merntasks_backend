import express from 'express';
const router = express.Router();

import {
        registrar, 
        autenticar, 
        confirmar,
        olvidePassword, 
        comprobarToken, 
        nuevoPassword,
        perfil,
        } from '../Controllers/usuarioController.js';
    import checkAuth from '../middleware/checkAuth.js';

// AUTENTIFICACION, REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', registrar);//crea un nuevo usuario
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password',  olvidePassword);
// router.get('/olvide-password/:token',  comprobarToken);
// router.post('/olvide-password/:token',  nuevoPassword);
// si dos ruta omas rutas tienen la misma ruta se puede acortar con el codigo de abajo
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);//verifica que el token sea valido que exista que este enviado via headers todas las comprobaciones necesarias







export default router;