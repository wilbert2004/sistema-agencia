//importamos la bd
const { db } = require("../../config/database.js");

//funcion para obtener todas las especialidades de la base de datos
async function obtenerEspecialidades() {
  const especialidades = await db.orm.public.Especialidades.select(
    //definimos lo que nos va mostrar
    "idEspecialidad",
    "nombreEspecialidad",
  ).all();
  return especialidades;
}

//funcion para obtener una especialidad por su id
async function obtenerEspecialidadPorId(id) {
  return db.orm.public.Especialidades.where({ idEspecialidad: id }).first();
}

//funcion para crear una especialidad
async function crearEspecialidad(nombreEspecialidad) {
  //crearemos una variable para guardar la especialidad creada
  const nombre = nombreEspecialidad.trim(); // Eliminar espacios en blanco al inicio y al final

  //crearemos el orm de la especialidad existente
  const especialidadExistente = await db.orm.public.Especialidades.where({
    nombreEspecialidad: nombre,
  }).first();

  //validamos si la especialidad ya existe
  if (especialidadExistente) {
    return {
      //un success false y un mensaje de error
      success: false,
      message: "La especialidad ya existe",
    };
  }

  //si no existe la especialidad la creamos
  const especialidad = await db.orm.public.Especialidades.create({
    nombreEspecialidad: nombre,
  });

  //devolvemos con u nreturn y succes tru y un message
  return {
    success: true,
    message: "Especialidad creada correctamente",
    data: especialidad,
  };
}

//funcion para actualizar una especialidad
async function actualizarEspecialidad(id, nombreEspecialidad) {
  //crearemos una variable para guardar la especialidad creada
  const especialidad = await db.orm.public.Especialidades.where({
    idEspecialidad: id,
  }).first();

  //verificamos si exite la especialidad
  if (!especialidad) {
    return {
      success: false,
      message: "La especialidad no existe",
    };
  }

  //crearemos una  varaible parta guargar el parametro de nombreEspecialidad
  const nombre = nombreEspecialidad.trim(); // Eliminar espacios en blanco al inicio y al final

  //coregimos que el nombre de la especialidad no tenga separaciones al inicio y al final
  if (nombre.length === 0) {
    return {
      success: false,
      message: "El nombre de la especialidad no debe estar vacío",
    };
  }

  //crearemos el orm de la especialidad existente
  const especialidadExistente = await db.orm.public.Especialidades.where({
    nombreEspecialidad: nombre,
  }).first();

  //validamos que la especialidad no se repita con el mismo nombre
  if (especialidadExistente && especialidadExistente.idEspecialidad !== id) {
    return {
      success: false,
      message: "La especialidad ya existe",
    };
  }

  //si no existe la especialidad la actualizamos
  const especialidadActualizada = await db.orm.public.Especialidades.where({
    idEspecialidad: id,
  }).update({
    nombreEspecialidad: nombre,
  });
  //devolvemos con u nreturn y succes tru y un message
  return {
    success: true,
    message: "Especialidad actualizada correctamente",
    data: especialidadActualizada,
  };
}

//funcion para eliminar una especialidad
async function eliminarEspecialidad(id) {
  //verificamos si exite la especialidad
  const especialidad = await db.orm.public.Especialidades.where({
    idEspecialidad: id,
  }).first();

  //verificamos si la especialidad existe
  if (!especialidad) {
    return {
      success: false,
      message: "La especialidad no encontrada",
    };
  }

  //validamos la relacion de la especialidad con el trabajador
  const relacion = await db.orm.public.TrabajadorEspecialidad.where({
    idEspecialidad: id,
  }).first();

  //si existe la relacion no se puede eliminar la especialidad
  if (relacion) {
    return {
      success: false,
      message:
        "No se puede eliminar la especialidad porque está relacionada con un trabajador",
    };
  }

  //eliminadmos la especialidad de la base de datos
  await db.orm.public.Especialidades.where({
    idEspecialidad: id,
  }).delete();
  //devolvemos con u nreturn y succes tru y un message
  return {
    success: true,
    message: "Especialidad eliminada correctamente",
  };
}

//exportamos las funciones
module.exports = {
  obtenerEspecialidades,
  obtenerEspecialidadPorId,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad,
};
