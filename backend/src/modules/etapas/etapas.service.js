//importamos la base de datos
const { db } = require("../../config/database");

//funcion para obtener todas las etapas
async function obtenerEtapas() {
  const etapas = await db.orm.public.Etapas.select(
    "idEtapa",
    "nombreEtapa",
    "descripcion",
  ).all();
  return {
    success: true,
    message: "Etapas obtenidas correctamente",
    data: etapas,
  };
}

//funcion para obtener una etapa por su id
async function obtenerEtapaPorId(id) {
  const etapa = await db.orm.public.Etapas.where({
    idEtapa: id,
  }).first();

  //verificamos si la etapa existe
  if (!etapa) {
    return {
      success: false,
      message: "Etapa no encontrada",
    };
  }

  //si existe la etapa lo devolvemos con un success true y un message
  return {
    success: true,
    message: "Etapa obtenida correctamente",
    data: etapa,
  };
}

//funcion para crear una etapa
async function crearEtapa(nombreEtapa, descripcion) {
  //variable para guardar el nombre de la etapa
  const nombre = nombreEtapa.trim(); // Eliminar espacios en blanco al inicio y al final
  //verificamos si la etapa ya existe
  const etapaExistente = await db.orm.public.Etapas.where({
    nombreEtapa: nombre,
  }).first();

  //lanzamos una condicion para verificar si la etapa ya existe
  if (etapaExistente) {
    return {
      success: false,
      message: "La etapa ya existe con ese nombre",
    };
  }

  //si no existe la etapa la creamos
  const Etapa = await db.orm.public.Etapas.create({
    nombreEtapa: nombre,
    descripcion:
      descripcion === undefined || descripcion === null
        ? null
        : descripcion.trim(),
  });

  //si todo bien regresamos un success true y un message de que se creo la etapa
  return {
    success: true,
    message: "Etapa creada correctamente",
    data: Etapa,
  };
}

//funcion para actualizar una etapa
async function actualizarEtapa(id, nombreEtapa, descripcion) {
  //verificamos si la etapa existe
  const etapaExistente = await db.orm.public.Etapas.where({
    idEtapa: id,
  }).first();

  //lanzamos una condicion para verificar si la etapa no existe
  if (!etapaExistente) {
    return {
      success: false,
      message: "Etapa no encontrada",
    };
  }

  const nombre = nombreEtapa.trim(); // Eliminar espacios en blanco al inicio y al final

  const etapaConMismoNombre = await db.orm.public.Etapas.where({
    nombreEtapa: nombre,
  }).first();

  //verificamos si la etapa con el mismo nombre existe y no es la misma que se quiere actualizar
  if (etapaConMismoNombre && etapaConMismoNombre.idEtapa !== id) {
    return {
      success: false,
      message: "Ya existe otra etapa con ese nombre",
    };
  }

  //si todo bien actualizamos la etapa
  const etapaActualizada = await db.orm.public.Etapas.where({
    idEtapa: id,
  }).update({
    nombreEtapa: nombre,
    descripcion:
      descripcion === undefined || descripcion === null
        ? null
        : descripcion.trim(),
  });

  //si todo bien regresamos un success true y un message de que se actualizo la etapa
  return {
    success: true,
    message: "Etapa actualizada correctamente",
    data: etapaActualizada,
  };
}

//funcion para eliminar una etapa
async function eliminarEtapa(id) {
  //verificamos si la etapa existe
  const etapaExistente = await db.orm.public.Etapas.where({
    idEtapa: id,
  }).first();
  //lanzamos una condicion para verificar si la etapa no existe
  if (!etapaExistente) {
    return {
      success: false,
      message: "Etapa no encontrada",
    };
  }
  //verificamos si la etapa esta siendo utilizada en algun proyecto
  const etapaEnProyecto = await db.orm.public.ProyectoEtapa.where({
    idEtapa: id,
  }).first();
  //si la etapa esta siendo utilizada en algun proyecto no se puede eliminar
  if (etapaEnProyecto) {
    return {
      success: false,
      message:
        "No se puede eliminar la etapa porque está siendo utilizada en un proyecto",
    };
  }
  //si todo bien eliminamos la etapa
  await db.orm.public.Etapas.where({
    idEtapa: id,
  }).delete();
  //si todo bien regresamos un success true y un message de que se elimino la etapa
  return {
    success: true,
    message: "Etapa eliminada correctamente",
  };
}

//exportamos la etapas
module.exports = {
  obtenerEtapas,
  obtenerEtapaPorId,
  crearEtapa,
  actualizarEtapa,
  eliminarEtapa,
};

/**propiedad de etapas 
 * model Etapas {
  idEtapa        Int             @id(map: "pk_etapas") @default(autoincrement()) @map("id_etapa")
  nombreEtapa    VarChar(100)    @unique(map: "uq_etapas_nombre") @map("nombre_etapa")
  descripcion    String?
  proyectoEtapas ProyectoEtapa[]

  @@map("etapas")
}

 */
