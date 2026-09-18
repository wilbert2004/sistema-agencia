//importamos la base de datos
const { db } = require("../../config/database");

//funcion para obtener todos los servicios de la base de datos\
async function obtenerServicios() {
  //obtenemos todos los servicios de la base de datos
  const servicios = await db.orm.public.Servicios.select(
    "idServicio",
    "nombreServicio",
    "descripcion",
    "precioBase",
  ).all();

  //devolvemos con un succes tru y mesage y data
  return {
    success: true,
    message: "Servicios obtenidos correctamente",
    data: servicios,
  };
}

//funcion async para obtener un servicio por su id
async function obtenerServicioPorId(id) {
  const servicio = await db.orm.public.Servicios.where({
    idServicio: id,
  }).first();

  //verificamos si el servicio existe
  if (!servicio) {
    return {
      success: false,
      message: "Servicio no encontrado",
    };
  }

  //si existe el servicio lo devolvemos con un success true y un message
  return {
    success: true,
    message: "Servicio obtenido correctamente",
    data: servicio,
  };
}

//funcion async para crear un servicio
async function crearServicio(nombreServicio, descripcion, precioBase) {
  //variable para guardar el nombre del servicio
  const nombre = nombreServicio.trim(); // Eliminar espacios en blanco al inicio y al final
  // variable para el precio base
  const precio = Number(precioBase); // Convertir a número decimal

  //verificamos si el servicio ya existe
  const servicioExistente = await db.orm.public.Servicios.where({
    nombreServicio: nombre,
  }).first();

  //lanzamos una condicion para verificar si el servicio ya existe
  if (servicioExistente) {
    return {
      success: false,
      message: "El servicio ya existe con ese nombre",
    };
  }
  //si no esta el servicio lo creamos y lanzamos un 201

  const servicio = await db.orm.public.Servicios.create({
    nombreServicio: nombre,
    descripcion:
      descripcion === undefined || descripcion === null
        ? null
        : descripcion.trim(),
    precioBase: precio,
  });

  //devokvemos un success true y un message de que se creo el servicio 201
  return {
    success: true,
    message: "Servicio creado correctamente",
    data: servicio,
  };
}

//exportamos la funcion
module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
};
