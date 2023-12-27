import express  from "express";
import dotenv from "dotenv";
import cors from 'cors';//este paquete permite implementar las conexiones desde el dominio del front end
import conectarDB from "./config/db.js";
import usuarioRoutes from './Routes/usuarioRoutes.js'
import proyectoRoutes from './Routes/proyectoRoutes.js'
import tareaRoutes from './Routes/tareaRoutes.js'

const app = express();
app.use(express.json());//para que procese informacion de tipo json 

dotenv.config();

conectarDB();

//configurar cors
const whiteList = [process.env.FRONTEND_URL || 'http://localhost:5173'];//dominios permitidos Y PARA ASIGNAR UNA VARIABLE DE ENTORNO SE OCUPA process.env y se conecta al frontend

const corsOption = {
    origin: function (origin,callback){
        console.log(origin);
        if (whiteList.includes(origin)) {
            //puede consultar el api
            callback(null, true);
        }else{
            //no esta permitido
            callback(new Error ('error de cors'));
        }
    }
};

app.use(cors(corsOption));

// Routing
// response= pedir
// response= respuesta
// send nos permite ver informacion en pantalla de lado de express
// use soporta las 4 tipos de peticiones get put post path

// login
app.use("/api/usuarios", usuarioRoutes);
//proyectos
app.use("/api/proyectos", proyectoRoutes);
//tareas
app.use("/api/tareas", tareaRoutes);


const PORT = process.env.PORT || 4000;   //ESTA VARIABLE SE CREA DIRECCTAMENTE EN EL SERRVIDOR DE PRODUCCION
const servidor = app.listen(PORT, () =>{
    console.log(`servidor corriendo en el puerto ${PORT}`);
});

// SOCKET IO
import { Server} from 'socket.io'

const io = new Server(servidor,{
    pingTimeout: 6000 ,
    cors:{
        origin: process.env.FRONTEND_URL
    },
});

io.on('connection',(socket) =>{
    console.log(' conectado a socket.io')

    //definir los eventos de socket io
    socket.on('abrir proyecto', (proyecto) =>{
        socket.join(proyecto); 
    });

    socket.on('nueva tarea', (tarea) =>{
        const proyecto = tarea.proyecto ;
        socket.to(tarea.proyecto).emit('tarea agregada', tarea )
    });
    socket.on('eliminar tarea', (tarea) =>{
        const proyecto = tarea.proyecto ;
        socket.to(proyecto).emit('tarea eliminada', tarea )
    });
    socket.on('actualizar tarea', (tarea) =>{
        const proyecto = tarea.proyecto._id ;
        socket.to(proyecto).emit('tarea actualizada', tarea )
    });
    socket.on('cambiar estado', (tarea) =>{
        const proyecto = tarea.proyecto._id ;
        socket.to(proyecto).emit('nuevo estado', tarea )
    });

})