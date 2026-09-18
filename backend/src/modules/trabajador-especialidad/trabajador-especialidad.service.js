const { db } = require("../../config/database");

//crearemos la funcion asyncrona de get
async function obtenerTrabajadorEspecialidad() {
  //verificamos las relaciones
  const relaciones = await db.orm.public.TrabajadorEspecialidad.select(
    "idTrabajador",
    "idEspecialidad",
  ).all();

  return {
    success: true,
    message: "Relaciones obtenidas correctamente",
    data: relaciones,
  };
}

//obtener trabajador por id
async function obtenerTrabajadorEspecialidadporId(
  idTrabajador,
  idEspecialidad,
) {
  //verificamos las relaciones de trabajador-especialidad
  const relacion = await db.orm.public.TrabajadorEspecialidad.where({
    idTrabajador: idTrabajador,
    idEspecialidad: idEspecialidad,
  }).first();

  //verificamos si la relacion existe
  if (!relacion) {
    return {
      success: false,
      message: "La relacion de trabajador-especialidad no existe",
    };
  }

  // si todo bien mandamos un success true y un mensaje de que se obtuvo la relacion
  return {
    success: true,
    message: "Relacion de trabajador-especialidad obtenida correctamente",
    data: relacion,
  };
}

//funcion post para crear la relacion de trabajador-especialidad
async function crearTrabajadorEspecialidad(idTrabajador, idEspecialidad) {
  //verificamos si el trabajador existe
  const trabajador = await db.orm.public.Trabajadores.where({
    idTrabajador: idTrabajador,
  }).first();

  //condicion de verificar si el trabajador existe
  if (!trabajador) {
    return {
      success: false,
      message: "El trabajador no existe",
    };
  }

  //verificamos que el trabajador este activo
  const usuario = await db.orm.public.Usuarios.where({
    idUsuario: trabajador.idUsuario,
  }).first();

  //condicion de verificar si el trabajador esta activo
  if (!usuario || !usuario.activo) {
    return {
      success: false,
      message: "El trabajador no esta activo",
    };
  }

  //verioficamos que la especialidad exista
  const especialidad = await db.orm.public.Especialidades.where({
    idEspecialidad: idEspecialidad,
  }).first();

  //condicion de verificar si la especialidad existe
  if (!especialidad) {
    return {
      success: false,
      message: "La especialidad no existe",
    };
  }

  //verificar que la relacion no exista
  const relacionExistente = await db.orm.public.TrabajadorEspecialidad.where({
    idTrabajador: idTrabajador,
    idEspecialidad: idEspecialidad,
  }).first();

  //condicion de verificar si la relacion existe
  if (relacionExistente) {
    return {
      success: false,
      message: "La relacion de trabajador-especialidad ya existe",
    };
  }

  //crear la relacion de trabajador-especialidad
  const relacion = await db.orm.public.TrabajadorEspecialidad.create({
    idTrabajador: idTrabajador,
    idEspecialidad: idEspecialidad,
  });

  //si todo bien mandamos un success true y un mensaje de que se creo la relacion
  return {
    success: true,
    message: "Relacion de trabajador-especialidad creada correctamente",
    data: relacion,
  };
}

//funcion para eliminar la relacion de trabajador-especialidad
async function eliminarTrabajadorEspecialidad(idTrabajador, idEspecialidad) {
  //verificamos si la relacion existe
  const relacion = await db.orm.public.TrabajadorEspecialidad.where({
    idTrabajador: idTrabajador,
    idEspecialidad: idEspecialidad,
  }).first();

  //condicion de verificar si la relacion existe
  if (!relacion) {
    return {
      success: false,
      message: "La relacion de trabajador-especialidad no existe",
    };
  }

  //eliminamos la relacion de trabajador-especialidad
  await db.orm.public.TrabajadorEspecialidad.where({
    idTrabajador: idTrabajador,
    idEspecialidad: idEspecialidad,
  }).delete();

  //si todo bien mandamos un success true y un mensaje de que se elimino la relacion
  return {
    success: true,
    message: "Relacion de trabajador-especialidad eliminada correctamente",
    data: relacion,
  };
}

//exportamos las funciones
module.exports = {
  obtenerTrabajadorEspecialidad,
  obtenerTrabajadorEspecialidadporId,
  crearTrabajadorEspecialidad,
  eliminarTrabajadorEspecialidad,
};
