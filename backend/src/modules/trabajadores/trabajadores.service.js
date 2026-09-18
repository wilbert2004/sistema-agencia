const { db } = require("../../config/database");

//funcion para obtener todo los trabajadores de la base de datos
async function obtenerTrabajadores() {
  return db.orm.public.Trabajadores.select(
    "idTrabajador",
    "idUsuario",
    "puesto",
  ).all();
}

//funcion para obtener un trabajador por su id
async function obtenerTrabajadorPorId(id) {
  return db.orm.public.Trabajadores.where({ idTrabajador: id }).first();
}

//funcioon para mandar un trabajador en un post
async function crearTrabajador(datos) {
  //
  const idUsuario = Number(datos.idUsuario);

  const usuario = await db.orm.public.Usuarios.where({
    idUsuario,
  }).first();

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  if (!usuario.activo) {
    throw new Error("Usuario inactivo");
  }

  if (usuario.idRol !== 2) {
    throw new Error("Usuario no es un trabajador");
  }

  const trabajadorExistente = await db.orm.public.Trabajadores.where({
    idUsuario,
  }).first();

  if (trabajadorExistente) {
    throw new Error("trabajador ya existe");
  }

  return db.orm.public.Trabajadores.create({
    idUsuario,
    puesto: datos.puesto.trim(),
  });
}
//funcion para actualizar un trabajador
async function actualizarTrabajador(id, datos) {
  return await db.orm.public.Trabajadores.where({ idTrabajador: id }).update({
    puesto: datos.puesto.trim(),
  });
}

//funcion para eliminar un trabajador
async function eliminarTrabajador(id) {
  const trabajadores = await db.orm.public.Trabajadores.where({
    idTrabajador: id,
  }).first();

  //verificamos si el trabajador existe
  if (!trabajadores) {
    throw new Error("Trabajador no encontrado");
  }

  await db.orm.public.Usuarios.where({
    idUsuario: trabajadores.idUsuario,
  }).update({
    activo: false,
  });
  //devolvemos un mensaje de exito
  return {
    success: true,
    message: "Trabajador eliminado exitosamente",
    //y el valor del trabajador eliminado
    data: trabajadores,
  };
}
//exportar
module.exports = {
  obtenerTrabajadores,
  obtenerTrabajadorPorId,
  crearTrabajador,
  actualizarTrabajador,
  eliminarTrabajador,
};
