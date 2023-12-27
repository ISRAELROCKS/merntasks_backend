import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        require: true,
    },
    descripcion:{
        type: String,
        trim: true,
        require: true,
    },
    estado:{
        type: Boolean,
        default: false,
    },
    fechaEntrega:{
        type: Date,
        require: true,
        default:Date.now(),
    },
    prioridad:{
        type: String,
        require: true,
        enum:["baja","media","alta"],
    },
    proyecto:{
        type:mongoose.Schema.ObjectId,
        ref:'Proyecto'
    },
    completado :{
        type:mongoose.Schema.ObjectId,
        ref:'Usuario',
        default: null,
    }
},{
    timestamps:true 
});

const Tarea = mongoose.model("Tarea",tareaSchema);

export default Tarea;