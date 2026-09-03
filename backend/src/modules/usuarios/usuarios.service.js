const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
//esta funcion nos sirve para obtener todos los usuarios de la base de datos
async function obtenerUsuarios() {
  return db.orm.public.Usuarios.select(
    "idUsuario",
    "idRol",
    "nombre",
    "correo",
    "activo",
    "fechaRegistro",
  ).all();
}

//esta funcion nos sirve para obtener un usuario por su id
async function obtenerUsuarioPorId(id) {
  return db.orm.public.Usuarios.where({ idUsuario: id })
    .select("idUsuario", "idRol", "nombre", "correo", "activo", "fechaRegistro")
    .first();
}

//creremos un apyrest de mandar usuario en tipo post en la bd
async function crearUsuario(datos) {
  //crearemos una varibale con propiedades manejando
  const correo = datos.correo.trim().toLowerCase();

  //verificamos si el correo ya existe en la base de datos
  const usuarioExistente = await db.orm.public.Usuarios.where({
    correo,
  }).first();
  if (usuarioExistente) {
    //crearemso el error con el mensaje de que el correo ya existe
    const error = new Error("El correo ya está registrado");
    error.statusCode = 409; // Bad Request
    throw error;
  }

  //asignacion de un rol
  const rol = await db.orm.public.Roles.where({ idRol: datos.idRol }).first();
  if (!rol) {
    const error = new Error("El rol especificado no existe");
    error.statusCode = 400; // Bad Request
    throw error;
  }

  //crearemos una contrasenia hash para guardar en la base de datos
  const contrasenaHash = await bcrypt.hash(datos.contrasena, 10);

  //en dado caso que el usuarip cumpla todo eso se crea el post de uisuario en la base de datos
  const nuevoUsuario = await db.orm.public.Usuarios.create({
    idRol: Number(datos.idRol),
    nombre: datos.nombre.trim(),
    correo,
    contrasenaHash,
    activo: true,
  });

  //retornamos el nuevo usuario creado
  return nuevoUsuario;
}

//exportamos las funciones para que puedan ser utilizadas en otros archivos
module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
};
