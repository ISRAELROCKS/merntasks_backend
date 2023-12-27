import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            trim: true,
            require: true,
        },
        descripcion: {
            type: String,
            trim: true,
            require: true,
        },
        fechaEntrega: {
            type: Date,
            trim: Date.now(),
            require: true,
        },
        cliente: {
            type: String,
            trim: true,
            require: true,
        },
        creador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        },
        tareas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tarea',  
            }
        ],

        colaboradores:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Usuario',  
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Proyecto = mongoose.model("Proyecto",proyectoSchema);
export default Proyecto;
