//require de la base de datios
const { db } = require("../../config/database.js");

//crearemos un variable para el rol de cliente en especifico
const ROL_CLIENTE = 3;
//funcion para obtener todos los clientes de la base de datos
async function obtenerClientes() {
  return db.orm.public.Clientes.select(
    "idCliente",
    "idUsuario",
    "empresa",
    "telefono",
    "direccion",
  ).all();
}

//crearemos la funcion para obtener los clientes por su id
async function obtenerClientePorId(id) {
  //rreturnaremos el cliente encontrado o null si no se encuentra
  return await db.orm.public.Clientes.where({ idCliente: id }).first();
}

//crearemso la funcion de crear clientes
async function crearClientes(datos) {
  //creeremos una variable para el cliente creado
  const idUsuario = Number(datos.idUsuario);

  //validaremos que el idUsuario sea un numero entero positivo
  const usuario = await db.orm.public.Usuarios.select(
    "idUsuario",
    "idRol",
    "activo",
  )
    .where({ idUsuario })
    .first();
  //condiicon que el usuario no este vacio o nul
  if (!usuario) {
    const error = new Error("El usuario no existe");
    error.status = 400;
    throw error;
  }
  ////el usuario debe debe de tener el rol de cliente
  if (usuario.idRol !== ROL_CLIENTE) {
    const error = new Error("El usuario no tiene el rol de cliente");
    error.status = 400;
    throw error;
  }

  //verifcamos que el usuario este activo
  if (!usuario.activo) {
    const error = new Error("El usuario no esta activo");
    error.status = 400;
    throw error;
  }

  //se verifica que todo esos filtros y ya lkuego se crea el usuario con clientes con el id que le corresponde
  const ClienteExistente = await db.orm.public.Clientes.where({
    idUsuario,
  }).first();
  if (ClienteExistente) {
    const error = new Error("El usuario ya tiene un cliente asociado");
    error.status = 400;
    throw error;
  }

  //retturnamos el cliente creado
  return db.orm.public.Clientes.create({
    idUsuario,
    empresa: datos.empresa,
    telefono: datos.telefono,
    direccion: datos.direccion,
  });
}

//funcion para actualizar un cliente por su id
async function actualizarCliente(id, datos) {
  //actualizamos directamente las columna recibidas
  await db.orm.public.Clientes.where({ idCliente: id }).update(datos);
  //retornamos el cliente actualizado
  return db.orm.public.Clientes.where({ idCliente: id }).first();
}

//funcion para desactivar un cliente por su id
async function elimarCliente(id) {
  const cliente = await db.orm.public.Clientes.where({ idCliente: id }).first();
  //si el cliente no existe lanzamos un error
  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    error.status = 404;
    throw error;
  }

  //desactivamos el cliente en la base de datos
  await db.orm.public.Usuarios.where({ idUsuario: cliente.idUsuario }).update({
    activo: false,
  });

  //retornamos el cliente desactivado
  return cliente;
}

//exportamos los datos
module.exports = {
  obtenerClientes,
  //importamos los datos
  obtenerClientePorId,
  crearClientes,
  actualizarCliente,
  elimarCliente,
};
