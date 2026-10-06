//importamos la base de datos
const { db } = require("../../config/database");

//función para obtener todos los detalles de las propuestas
async function obtenerPropuestasDetalles() {
  const detalles = await db.orm.public.PropuestaDetalle.select(
    "idPropuestaDetalle",
    "idPropuesta",
    "idServicio",
    "cantidad",
    "precioUnitario",
    "subtotal",
  ).all();

  //luego devolver los detalles obtenidos
  return {
    success: true,
    message: "Detalles de propuestas obtenidos correctamente",
    data: detalles,
  };
}

//funcion para obtener un detalle de propuesta por id
async function obtenerPropuestasDetallePorId(id) {
  const detalle = await db.orm.public.PropuestaDetalle.select(
    "idPropuestaDetalle",
    "idPropuesta",
    "idServicio",
    "cantidad",
    "precioUnitario",
    "subtotal",
  )
    .where({ idPropuestaDetalle: id })
    .first();

  if (!detalle) {
    return {
      success: false,
      message: "Detalle de propuesta no encontrado",
    };
  }

  return {
    success: true,
    message: "Detalle de propuesta obtenido correctamente",
    data: detalle,
  };
}

//funcion para crear un detalle de propuesta
async function crearPropuestaDetalle({
  idPropuesta,
  idServicio,
  cantidad,
  precioUnitario,
}) {
  //verificamos que la propuesta si exista
  const propuesta = await db.orm.public.Propuestas.where({
    idPropuesta: idPropuesta,
  }).first();

  //si no existe la propuesta
  if (!propuesta) {
    return {
      success: false,
      status: 404,
      message: "La propuesta no existe",
    };
  }

  //verificar que la propuesta permita modificaciones
  const estadosModificables = ["pendiente", "enviada"];

  //validamos si el estado de la propuesta permite modificaciones
  if (!estadosModificables.includes(propuesta.estado)) {
    return {
      success: false,
      status: 400,
      message:
        "No se agregar un detalle por que la propuesta no esta en un estado modificable",
    };
  }

  //verificamos que el servicio si exista
  const servicio = await db.orm.public.Servicios.where({
    idServicio: idServicio,
  }).first();

  //si no existe el servicio
  if (!servicio) {
    return {
      success: false,
      status: 404,
      message: "El servicio no existe",
    };
  }

  //vericamos qeu el servicio no este repetido
  const detalleExistente = await db.orm.public.PropuestaDetalle.where({
    idPropuesta: idPropuesta,
    idServicio: idServicio,
  }).first();

  if (detalleExistente) {
    return {
      success: false,
      status: 409,
      message: "El servicio ya existe en la propuesta",
    };
  }

  //calculamos el subtotal
  const subtotal =
    Math.round((cantidad * precioUnitario + Number.EPSILON) * 100) / 100;

  //creamos el detalle de propuesta
  const detalle = await db.orm.public.PropuestaDetalle.create({
    idPropuesta: idPropuesta,
    idServicio: idServicio,
    cantidad: cantidad,
    precioUnitario: precioUnitario,
    subtotal: subtotal,
  });

  //luego devolver el detalle creado
  return {
    success: true,
    status: 201,
    message: "Detalle de propuesta creado correctamente",
    data: detalle,
  };
}

//funcion para actualizar un detalle de propuesta
async function actualizarPropuestaDetalle(id, { cantidad, precioUnitario }) {
  //verificamos que el detalle de propuesta si exista
  const detalle = await db.orm.public.PropuestaDetalle.where({
    idPropuestaDetalle: id,
  }).first();

  //si no existe el detalle de propuesta
  if (!detalle) {
    return {
      success: false,
      status: 404,
      message: "El detalle de propuesta no existe",
    };
  }

  //verificar que la propuesta permita modificaciones
  const propuesta = await db.orm.public.Propuestas.where({
    idPropuesta: detalle.idPropuesta,
  }).first();

  //si no existe la propuesta
  if (!propuesta) {
    return {
      success: false,
      status: 404,
      message: "La propuesta no existe",
    };
  }

  //los estados que permiten modificaciones
  const estadosModificables = ["pendiente", "enviada"];

  //validamos si el estado de la propuesta permite modificaciones
  if (!estadosModificables.includes(propuesta.estado)) {
    return {
      success: false,
      status: 400,
      message:
        "No se puede actualizar el detalle por que la propuesta no esta en un estado modificable",
    };
  }

  //en dado caso que no se actualize mantenemos los valores anteriores
  const nuevaCantidad = cantidad !== undefined ? cantidad : detalle.cantidad;
  //en dado caso que no se actualize mantenemos los valores anteriores
  const nuevoPrecioUnitario =
    precioUnitario !== undefined ? precioUnitario : detalle.precioUnitario;

  //volvemos a calcular el subtotal
  const nuevoSubtotal =
    Math.round((nuevaCantidad * nuevoPrecioUnitario + Number.EPSILON) * 100) /
    100;

  //actualizamos el detalle de propuesta
  const detalleActualizado = await db.orm.public.PropuestaDetalle.where({
    idPropuestaDetalle: id,
  }).update({
    cantidad: nuevaCantidad,
    precioUnitario: nuevoPrecioUnitario,
    subtotal: nuevoSubtotal,
  });

  //luego devolver el detalle actualizado
  return {
    success: true,
    status: 200,
    message: "Detalle de propuesta actualizado correctamente",
    data: detalleActualizado,
  };
}

//funcion para eliminar un detalle de propuesta
async function eliminarPropuestaDetalle(id) {
  //verificamos que el detalle de propuesta si exista
  const detalle = await db.orm.public.PropuestaDetalle.where({
    idPropuestaDetalle: id,
  }).first();
  //si no existe el detalle de propuesta
  if (!detalle) {
    return {
      success: false,
      status: 404,
      message: "El detalle de propuesta no existe",
    };
  }

  //verificamos que la propuesta exista
  const propuesta = await db.orm.public.Propuestas.where({
    idPropuesta: detalle.idPropuesta,
  }).first();

  //si no existe la propuesta
  if (!propuesta) {
    return {
      success: false,
      status: 404,
      message: "La propuesta no existe",
    };
  }

  //verificar que la propuesta permita modificaciones
  const estadosModificables = ["pendiente", "enviada"];

  //validamos si el estado de la propuesta permite modificaciones
  if (!estadosModificables.includes(propuesta.estado)) {
    //si no permite modificaciones devolvemos un error
    return {
      success: false,
      status: 400,
      message:
        "No se puede eliminar el detalle por que la propuesta no esta en un estado modificable",
    };
  }

  //eliminamos el detalle de propuesta
  await db.orm.public.PropuestaDetalle.where({
    idPropuestaDetalle: id,
  }).delete();

  //luego devolver el detalle eliminado
  return {
    success: true,
    status: 200,
    message: "Detalle de propuesta eliminado correctamente",
  };
}

//exportamos la funcion
module.exports = {
  obtenerPropuestasDetalles,
  obtenerPropuestasDetallePorId,
  crearPropuestaDetalle,
  actualizarPropuestaDetalle,
  eliminarPropuestaDetalle,
};
