//importamos la base de datos
const { db } = require("../../config/database");

//funcion para obtener los roles de cada usuario
async function obtenerRoles() {
  return db.orm.public.Roles.select("idRol", "nombre", "descripcion").all();
}

//funcion para obtener un rol por su id
async function obtenerRolPorId(id) {
  const resultado = await db.orm.public.Roles.select(
    "idRol",
    "nombre",
    "descripcion",
  )
    .where({ idRol: id })
    .first();

  //returnamos el resultado del rol encontrado o null si no se encuentra
  return resultado || null;
}

//funciona para crear un rol en la base de datos
async function crearRol(datos) {
  const nombrelimpio = datos.nombre.trim();

  //validar duplicado de nombre de rol
  const rolesExistentes = await db.orm.public.Roles.select(
    "idRol",
    "nombre",
    "descripcion",
  ).where({
    nombre: nombrelimpio,
  });
  if (rolesExistentes.length > 0) {
    const error = new Error("El nombre del rol ya existe");
    error.statusCode = 400; // Bad Request
    throw error;
  }
  return await db.orm.public.Roles.create({
    nombre: nombrelimpio,
    descripcion: datos.descripcion ? datos.descripcion.trim() : null,
  });
}

//actualizar rol en la base de datos
async function actualizarRol(id, datos) {
  const rolExistente = await db.orm.public.Roles.select(
    "idRol",
    "nombre",
    "descripcion",
  )
    .where({ idRol: id })
    .first();
  if (!rolExistente) {
    const error = new Error("El rol especificado no existe");
    error.statusCode = 404; // Not Found
    throw error;
  }

  await db.orm.public.Roles.where({ idRol: id }).update({
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim() || null,
  });

  //retornamos el rol actualizado
  return await db.orm.public.Roles.select("idRol", "nombre", "descripcion")
    .where({ idRol: id })
    .first();
}

//eliminar rol en la base de datos
async function eliminarRol(id) {
  //verificar si el rol existe
  const rolExistente = await db.orm.public.Roles.select(
    "idRol",
    "nombre",
    "descripcion",
  )
    .where({ idRol: id })
    .first();
  if (!rolExistente) {
    const error = new Error("El rol especificado no existe");
    error.statusCode = 404; // Not Found
    throw error;
  }
  //eliminar el rol
  await db.orm.public.Roles.where({ idRol: id }).delete();
  return { message: "Rol eliminado correctamente" };
}

module.exports = {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
};
