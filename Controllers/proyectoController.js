import mongoose from 'mongoose';
import Proyecto from '../models/Proyecto.js';

import Usuario from '../models/Usuario.js';


const obtenerProyectos = async (req,res) =>{
    //.find traera todos los proyectos almacenados en la bd find =encontrar
    const proyectos = await Proyecto.find({
        '$or' : [
            { colaboradores:{$in: req.usuario}},
            { creador:{$in: req.usuario}},
        ],
    }).select('-tareas')
    res.json(proyectos);
};

const nuevoProyecto = async (req,res) =>{
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const obtenerProyecto = async (req,res) =>{
    const {id}  = req.params;

    // const valid = mongoose.Types.ObjectId.isValid(id);
    //     if (!valid){
    //         const error = new Error('Error proyecto no valido');
    //         return res.status(404).json({msg: error.message});
    //     }

    const proyecto = await Proyecto.findById(id)
        .populate({path: 'tareas', populate: {path: 'completado', selct:'nombre, '}})
        .populate('colaboradores','nombre email');
        if(!proyecto){
            const error = new Error('no encontrado');
            return res.status(404).json({msg: error.message});
        }
        if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(
            (colaborador) => colaborador._id.toString() === req.usuario._id.toString())
        ){
            const error = new Error('accion no valida');
            return res.status(401).json({msg: error.message});
        }
       
        res.json(
            proyecto
            
        );
};

const editarProyecto = async (req,res) =>{
    const {id}  = req.params;
    // const proyecto = await Proyecto.findById(id);
    const valid = mongoose.Types.ObjectId.isValid(id);
        if (!valid){
            const error = new Error('Error proyecto no valido');
            return res.status(404).json({msg: error.message});
        }
    const proyecto = await Proyecto.findById(id);
        if(!proyecto){
            const error = new Error('no encontrado');
            return res.status(404).json({msg: error.message});
        }
        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('accion no valida');
            return res.status(401).json({msg: error.message});
        }

        //actualizacion de datos
    proyecto.nombre = req.body.nombre || proyecto.nombre;//busca en proyecto se actualiza si no se actualiza asigna nombre de bd 
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();
        return res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarProyecto = async (req,res) =>{
    const {id}  = req.params;
    // const proyecto = await Proyecto.findById(id);
    const valid = mongoose.Types.ObjectId.isValid(id);
        if (!valid){
            const error = new Error('Error proyecto no valido');
            return res.status(404).json({msg: error.message});
        }
    const proyecto = await Proyecto.findById(id);
        if(!proyecto){
            const error = new Error('no encontrado');
            return res.status(404).json({msg: error.message});
        }
        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('accion no valida');
            return res.status(401).json({msg: error.message});
        }
    //metodo de mongoose para eliminar 

    try {
       await proyecto.deleteOne();//delteone nos permite eliminar un documento en la bd de mongoose 
       res.json({msg:'proyecto eliminado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const buscarColaborador = async (req,res) =>{
    const {email} = req.body

    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -password -token -updatedAt -__v")

    if(!usuario){
        const error = new Error ('usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    res.json(usuario);
};

const agregarColaborador = async (req,res) =>{

   const proyecto = await Proyecto.findById(req.params.id);
  
   if(!proyecto){
    const error = new Error('proyecto no encontrado')
    return res.status(404).json({msg: error.message})
   }
   if(proyecto.creador.toString() !==  req.usuario.id.toString()){
    const error = new Error('Accion no valida')
    return res.status(404).json({msg: error.message})
   }
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -password -token -updatedAt -__v")

    if(!usuario){
        const error = new Error ('usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    //el colaborador no es admin del proyecto
    if(proyecto.creador.toString()=== usuario.id.toString()){
        const error = new Error ('El creador del proyecto no puede ser colaborador')
        return res.status(404).json({msg: error.message})
    }
    //revisar que no esta ya agregado al proyecto
    if(proyecto.colaboradores.includes(usuario.id)){
        const error = new Error (
            'El usuario ya pertenece al proyecto '
        )
        return res.status(404).json({msg: error.message})
    }
    //esta bien se puede agragar 
    proyecto.colaboradores.push(usuario.id)
    await proyecto.save()
    res.json({msg:'colaborador agregado correctamente'})
};



const eliminarColaborador = async (req,res) =>{
    
    const proyecto = await Proyecto.findById(req.params.id);
    if(!proyecto){
        const error = new Error('proyecto no encontrado')
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !==  req.usuario.id.toString()){
        const error = new Error('Accion no valida')
        return res.status(404).json({msg: error.message})
    }
    //esta bien se puede eliminar
    proyecto.colaboradores.pull(req.body.id)
    
    await proyecto.save()
    res.json({msg:'colaborador Eliminado correctamente'})

    
    
};




export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador,
    
 
}
