const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

//Crae una nueva tarea
exports.crearTarea = async(req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        //Extraer el proyecto y comprbar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async(req, res) => {

    try {
        //Extraemos el proyecto
        const { proyecto } = req.body;
            
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraemos el proyecto
        const { proyecto, nombre, estado } = req.body;

        //Revisar si la tarea existe o no
        let tareaExiste = await Tarea.findById(req.params.id);

        if(!tareaExiste){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Buscamos un proyecto por Id
        const existeProyecto = await Proyecto.findById(proyecto)

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Crear un objeto con la nueva info
        const nuevaTarea = {};

        if(nombre){
            nuevaTarea.nombre = nombre;
        }

        if(estado){
            nuevaTarea.estado = estado;
        }

        //Guardar la tarea
        tareaExiste = await Tarea.findByIdAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});

        res.json({tareaExiste})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraemos el proyecto
        const { proyecto } = req.body;

        //Revisar si la tarea existe o no
        let tareaExiste = await Tarea.findById(req.params.id);

        if(!tareaExiste){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Buscamos un proyecto por Id
        const existeProyecto = await Proyecto.findById(proyecto)

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}