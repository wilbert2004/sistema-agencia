//importamos la base de datos
const { db } = require("../../config/database");

//funcion para msoptrar todos los proyectos vinculados con etapa
async function obtenerProyectoEtapas() {
  const proyectoEtapas = await db.orm.public.ProyectoEtapa.select(
    "idProyectoEtapa",
    "idProyecto",
    "idEtapa",
    "fechaInicio",
    "fechaFin",
    "estado",
  ).all();
  return {
    success: true,
    message: "Proyectos vinculados con etapa obtenidos correctamente",
    data: proyectoEtapas,
  };
}

//funcion para mostrar un proyecto vinculado con etapa por id
async function obtenerProyectoEtapaPorId(id) {
  const proyectoEtapa = await db.orm.public.ProyectoEtapa.where({
    idProyectoEtapa: id,
  }).first();
  if (!proyectoEtapa) {
    return {
      success: false,
      message: "Proyecto vinculado con etapa no encontrado",
    };
  }
  return {
    success: true,
    message: "Proyecto vinculado con etapa obtenido correctamente",
    data: proyectoEtapa,
  };
}

//funcion para crear un proyecto vinculado con etapa
async function crearProyectoEtapa({
  idProyecto,
  idEtapa,
  fechaInicio,
  fechaFin,
}) {
  //validamos que el proyecto y la etapa existan
  const proyecto = await db.orm.public.Proyectos.where({ idProyecto }).first();

  //validamos que el proyecto y la etapa existan
  if (!proyecto) {
    return {
      success: false,
      status: 404,
      message: "Proyecto no encontrado",
    };
  }

  //validamos que el proyecto y la etapa existan
  const etapa = await db.orm.public.Etapas.where({ idEtapa }).first();
  //validamos que el proyecto y la etapa existan
  if (!etapa) {
    return {
      success: false,
      status: 404,
      message: "Etapa no encontrada",
    };
  }

  //validamos si es existente
  const existente = await db.orm.public.ProyectoEtapa.where({
    idProyecto,
    idEtapa,
  }).first();
  //si existe, retornamos un error
  if (existente) {
    return {
      success: false,
      status: 400,
      message: "El proyecto ya tiene asignada esta etapa",
    };
  }

  //validaremos los procesos que estaran limitados
  if (proyecto.estado === "finalizado" || proyecto.estado === "cancelado") {
    return {
      success: false,
      status: 400,
      message:
        "No se puede asignar etapas a un proyecto finalizado o cancelado",
    };
  }

  //creamos el proyecto vinculado con etapa
  const nuevaProyectoEtapa = await db.orm.public.ProyectoEtapa.create({
  idProyecto,
  idEtapa,
  fechaInicio: Temporal.PlainDate.from(fechaInicio),
  fechaFin: fechaFin ? Temporal.PlainDate.from(fechaFin) : null,
  estado: "pendiente",
});

  return {
    success: true,
    message: "Etapa asignada al proyecto correctamente",
    data: nuevaProyectoEtapa,
  };
}

module.exports = {
  obtenerProyectoEtapas,
  obtenerProyectoEtapaPorId,
  crearProyectoEtapa,
};

/**propiedad de la bd 
 * model ProyectoEtapa {
  idProyectoEtapa Int         @id(map: "pk_proyecto_etapa") @default(autoincrement()) @map("id_proyecto_etapa")
  idProyecto      Int         @map("id_proyecto")
  idEtapa         Int         @map("id_etapa")
  fechaInicio     Date        @map("fecha_inicio")
  fechaFin        Date?       @map("fecha_fin")
  estado          VarChar(30) @default("pendiente")
  etapas          Etapas      @relation(fields: [idEtapa], references: [idEtapa], onDelete: Restrict, map: "fk_proyecto_etapa_etapa")
  proyectos       Proyectos   @relation(fields: [idProyecto], references: [idProyecto], onDelete: Cascade, map: "fk_proyecto_etapa_proyecto")

  @@index([idEtapa], map: "idx_proyecto_etapa_etapa")
  @@index([idProyecto], map: "idx_proyecto_etapa_proyecto")
  @@check(expression: "((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'en_progreso'::character varying, 'completada'::character varying, 'cancelada'::character varying])::text[]))", map: "chk_proyecto_etapa_estado")
  @@check(expression: "((fecha_fin IS NULL) OR (fecha_fin >= fecha_inicio))", map: "chk_proyecto_etapa_fechas")
  @@map("proyecto_etapa")
}
 */
