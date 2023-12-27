import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro , emailOlvidePassword} from "../helpers/email.js";

const registrar = async (req,res) => {
    // evitar correos duplicados comprobacion
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email});
        if(existeUsuario){
            const error = new Error('ya existe un usuario con esa cuenta ');
            return res.status(400).json({msg: error.message})
        }
    try {
        const usuario = new Usuario(req.body);//crea un nuevo registro
        usuario.token = generarId();//se pasa desde archivo generarId que se encuentra en helpers y lo importamos 
        await usuario.save();//crea un nuevo registro lo almacena lo guarda en bd y lo muestra

        //neviare el email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });

        res.json({
            msg:'usuario creado correctamente, revisa tu email para confirmar tu cuenta'
        });
    } catch (error) {
        console.log(error);
    }
   
};

const autenticar = async (req,res) => {
    const {email,password} = req.body; //extraer email y pasword

    //comprobar si el usuario existe 
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});//404 es no encontrado 
    }
    //comprobar si el usuario esta comprobado 
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    //comprobar su password
    if(await usuario.comprobarPassword(password)){
       res.json({
        _id: usuario._id,
        nombre:usuario.nombre,
        email:usuario.email,
        token: generarJWT(usuario._id),
       });
    }else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }
}

const confirmar = async (req,res) => {
    const {token} = req.params;
    const usuarioConfirmar =await Usuario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(403).json({msg: error.message});
    }
    try{
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token ="";
        await usuarioConfirmar.save();
        res.json({msg: 'usuario confirmado correctamente'})
    }catch (error) {
        console.log(error);
    }
};

const olvidePassword = async (req,res) =>{
    // se extrae el email
    const {email} = req.body;
    // comprobamos si el usuario existe 
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});//404 es no encontrado 
    }

    try{
        usuario.token= generarId();
        console.log(usuario);
        await usuario.save();

        //TODO:Enviar email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({msg:'emos enviado un mensaje con las instrucciones'})

    }catch (error) {
        console.log(error);

    }

};

const comprobarToken = async (req,res) => {
    const {token} = req.params; //cuando se quieren extraere parametros de la url es con params

    const tokenValido = await Usuario.findOne({token});
    if (tokenValido){
        res.json({msg:'token valido y el usuario existe'});
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});//404 es no encontrado 
    }
};

const nuevoPassword = async (req,res) => {
    const {token} = req.params;
    const {password} = req.body

    const usuario = await Usuario.findOne({token});
    if (usuario){
        usuario.password = password;
        usuario.token = '';//proteje el token

        try{
            await usuario.save();//almacena los cambios en la base de datos
            res.json({msg:'password modificado correctamente'});//retorna mensaje mensaje de respuesta
        }catch (eror){
            console.log(eror);
        }
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});//404 es no encontrado 
    }
}

const perfil = async (req,res) => {
   const {usuario} = req;
   res.json(usuario);
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
};