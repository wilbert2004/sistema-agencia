const { db } = require("../../config/database");

//funcion para obtener todos los proyectos vinculados con servicio
async function obtenerProyectoServicio() {
  const proyectosServicio = await db.orm.public.ProyectoServicio.select(
    "idProyecto",
    "idServicio",
    "cantidad",
    "precioAcordado",
  ).all();
  return {
    success: true,
    message: "Proyectos vinculados con servicio obtenidos correctamente",
    data: proyectosServicio,
  };
}

//funcion para obtener los proyectos vinculados con servicio por id
async function obtenerProyectoServicioPorId(idProyecto, idServicio) {
  const proyectoServicio = await db.orm.public.ProyectoServicio.where({
    idProyecto: idProyecto,
    idServicio: idServicio,
  }).first();
  if (!proyectoServicio) {
    return {
      success: false,
      message: "No se encontró el proyecto vinculado con servicio",
    };
  }
  return {
    success: true,
    message: "Proyecto vinculado con servicio obtenido correctamente",
    data: proyectoServicio,
  };
}

//funcion para crear un proyecto vinculado con servicio
async function crearProyectoServicio(
  idProyecto,
  idServicio,
  cantidad,
  precioAcordado,
) {
  //verificamos que exista el proyecto
  const proyecto = await db.orm.public.Proyectos.where({
    idProyecto: idProyecto,
  }).first();

  if (!proyecto) {
    return {
      success: false,
      message: "No se encontró el proyecto",
    };
  }
  //verificamos que exista el servicio
  const servicio = await db.orm.public.Servicios.where({
    idServicio: idServicio,
  }).first();

  //verificamos que exista el servicio
  if (!servicio) {
    return {
      success: false,
      message: "No se encontró el servicio",
    };
  }
  //verificamos que no exista ya la relacion
  const proyectoServicioExistente = await db.orm.public.ProyectoServicio.where({
    idProyecto: idProyecto,
    idServicio: idServicio,
  }).first();

  if (proyectoServicioExistente) {
    return {
      success: false,
      message: "El proyecto ya está vinculado con el servicio",
    };
  }

  //creamos el proyecto vinculado con servicio
  const proyectoServicio = await db.orm.public.ProyectoServicio.create({
    idProyecto: idProyecto,
    idServicio: idServicio,
    cantidad: cantidad,
    precioAcordado: precioAcordado,
  });

  return {
    success: true,
    message: "Proyecto vinculado con servicio creado correctamente",
    data: proyectoServicio,
  };
}

//funcion para actualizar un proyecto vinculado con servicio
async function actualizarProyectoServicio(
  idProyecto,
  idServicio,
  { cantidad, precioAcordado },
) {
  //verificamos que exista el proyecto vinculado con servicio
  const proyectoServicio = await db.orm.public.ProyectoServicio.where({
    idProyecto: idProyecto,
    idServicio: idServicio,
  }).first();

  //verificamos que exista el proyecto vinculado con servicio
  if (!proyectoServicio) {
    return {
      success: false,
      status: 404,
      message: "El servicio no está asignado a este proyecto",
    };
  }
  //verificamos que al menos uno de los campos a actualizar sea proporcionado
  const datosActualizar = {};
  //verificamos que al menos uno de los campos a actualizar sea proporcionado
  if (cantidad !== undefined) {
    datosActualizar.cantidad = cantidad;
  }
  if (precioAcordado !== undefined) {
    datosActualizar.precioAcordado = precioAcordado;
  }

  const proyectoServicioActualizado =
    await db.orm.public.ProyectoServicio.where({
      idProyecto: idProyecto,
      idServicio: idServicio,
    }).update(datosActualizar);

  return {
    success: true,
    message: "Servicio del proyecto actualizado correctamente",
    data: proyectoServicioActualizado,
  };
}

//funcion para eliminar un proyecto vinculado con servicio
async function eliminarProyectoServicio(idProyecto, idServicio) {
  const proyectoServicio = await db.orm.public.ProyectoServicio.where({
    idProyecto: idProyecto,
    idServicio: idServicio,
  }).first();

  if (!proyectoServicio) {
    return {
      success: false,
      status: 404,
      message: "El servicio no está asignado a este proyecto",
    };
  }

  await db.orm.public.ProyectoServicio.where({
    idProyecto: idProyecto,
    idServicio: idServicio,
  }).delete();

  return {
    success: true,
    message: "Servicio eliminado del proyecto correctamente",
  };
}

//exportacion de modules
module.exports = {
  obtenerProyectoServicio,
  obtenerProyectoServicioPorId,
  crearProyectoServicio,
  actualizarProyectoServicio,
  eliminarProyectoServicio,
};
/**propiedades de la bd  model ProyectoServicio {
  idProyecto     Int            @map("id_proyecto")
  idServicio     Int            @map("id_servicio")
  cantidad       Int            @default(1)
  precioAcordado Numeric(12, 2) @map("precio_acordado")
  proyectos      Proyectos      @relation(fields: [idProyecto], references: [idProyecto], onDelete: Cascade, map: "fk_ps_proyecto", index: false)
  servicios      Servicios      @relation(fields: [idServicio], references: [idServicio], onDelete: Restrict, map: "fk_ps_servicio")

  @@id([idProyecto, idServicio], map: "pk_proyecto_servicio")
  @@index([idServicio], map: "idx_proyecto_servicio_servicio")
  @@check(expression: "(cantidad > 0)", map: "chk_ps_cantidad")
  @@check(expression: "(precio_acordado >= (0)::numeric)", map: "chk_ps_precio")
  @@map("proyecto_servicio")
} */
