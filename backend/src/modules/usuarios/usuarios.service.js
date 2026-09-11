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

//crearemos una funcion para actualizar un usuario en la base de datos
async function actualizarUsuario(id, datos) {
  //verificamos que el usuario exista en la base de datos
  const usuarioExistente = await db.orm.public.Usuarios.select("idUsuario")
    .where({ idUsuario: id })
    .first();

  //agregaremos la condicion que si no existe el usuario un errro
  if (!usuarioExistente) {
    const error = new Error("El usuario no encontrado");
    error.statusCode = 404; // Not Found
    throw error;
  }

  //declaremso una variable del data
  const data = {};

  //vamos a validar limpiar nombre
  if (datos.nombre !== undefined) {
    data.nombre = datos.nombre.trim();
  }

  //validar correo no duplicado
  if (datos.correo !== undefined) {
    const correo = datos.correo.trim().toLowerCase();
    // first() ejecuta la consulta y devuelve un usuario o null.
    const correoExistente = await db.orm.public.Usuarios.select(
      "idUsuario",
      "correo",
    )
      .where({ correo })
      .first();

    if (correoExistente && correoExistente.idUsuario !== id) {
      const error = new Error("El correo ya está registrado");
      error.statusCode = 409;
      throw error;
    }
    data.correo = correo;
  }

  //validar que el rol exista en la base de datos
  if (datos.idRol !== undefined) {
    const idRolNumero = Number(datos.idRol);

    // Se consulta el rol antes de actualizar para evitar guardar un idRol inexistente.
    const rolEncontrado = await db.orm.public.Roles.select("idRol")
      .where({ idRol: idRolNumero })
      .first();

    if (!rolEncontrado) {
      const error = new Error("El rol especificado no existe");
      error.statusCode = 400; // Bad Request
      throw error;
    }
    data.idRol = idRolNumero;
  }

  //estado activo/inactivo
  if (datos.activo !== undefined) {
    data.activo = Boolean(datos.activo);
  }

  //actualizamos el registro del usuario en la base de datos
  await db.orm.public.Usuarios.where({ idUsuario: id }).update(data);
  // Volvemos a consultar el usuario y omitimos la contraseña en la respuesta.
  return db.orm.public.Usuarios.select(
    "idUsuario",
    "idRol",
    "nombre",
    "correo",
    "activo",
    "fechaRegistro",
  )
    .where({ idUsuario: id })
    .first();
}

//validar la eliminacion de un usuario en la base de datos
async function eliminarUsuario(id) {
  //buscaremos el usuaerio por id
  const usuarioExistente = await db.orm.public.Usuarios.select(
    "idUsuario",
    "activo",
  )
    //entonces si no existe el usuario lanzaremos un error
    .where({ idUsuario: id })
    .first();

  //en dado caso que no exista lanzar un error 404
  if (!usuarioExistente) {
    const error = new Error("El usuario no encontrado");
    error.statusCode = 404; // Not Found
    throw error;
  }

  //si el usuario esta desactiuvado que mande un error 400
  if (!usuarioExistente.activo) {
    const error = new Error("El usuario ya esta desactivado");
    error.statusCode = 400; // Bad Request
    throw error;
  }

  //reralizaremos el borrado logico (actualizar activo a false )
  await db.orm.public.Usuarios.where({
    idUsuario: id,
  }).update({ activo: false });

  //retornaremos el usuario actualizaddo con sus datos limpios
  const usuarioActualizado = await db.orm.public.Usuarios.select(
    "idUsuario",
    "idRol",
    "nombre",
    "correo",
    "activo",
    "fechaRegistro",
  ).where({ idUsuario: id });

  //retornamos el usuario actualizado
  return usuarioActualizado[0];
}
//exportamos las funciones para que puedan ser utilizadas en otros archivos
module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
