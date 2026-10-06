//importamos la base de datos
const { db } = require("../../config/database");

//funcion para obtener todos los proyectos
async function obtenerProyectos() {
  const proyectos = await db.orm.public.Proyectos.select(
    "idProyecto",
    "idCliente",
    "idPropuesta",
    "nombreProyecto",
    "descripcion",
    "fechaInicio",
    "fechaFinEstimada",
    "estado",
  ).all();

  //luego devolver los proyectos obtenidos
  return {
    success: true,
    message: "Proyectos obtenidos correctamente",
    data: proyectos,
  };
}

//funcion para obtener un proyecto por id
async function obtenerProyectoPorId(id) {
  const proyecto = await db.orm.public.Proyectos.where({
    idProyecto: id,
  }).first();

  //si no existe el proyuecrto, devolvemos un error
  if (!proyecto) {
    return {
      success: false,
      message: "Proyecto no encontrado",
    };
  }

  //si existe el proyecto, devolvemos el proyecto
  return {
    success: true,
    message: "Proyecto obtenido correctamente",
    data: proyecto,
  };
}

//fuincion para crear un proyecto
async function crearProyecto({
  idCliente,
  idPropuesta,
  nombreProyecto,
  descripcion,
  fechaInicio,
  fechaFinEstimada,
}) {
  //verificamos que el cliente exista :
  const cliente = await db.orm.public.Clientes.where({
    idCliente: idCliente,
  }).first();

  //si no existe el cliente, devolvemos un error
  if (!cliente) {
    return {
      success: false,
      message: "Cliente no encontrado",
    };
  }

  //si se proporciona una propuesta
  //vberificamos que la propuesta exista
  let propuesta = null;

  if (idPropuesta !== undefined && idPropuesta !== null) {
    propuesta = await db.orm.public.Propuestas.where({
      idPropuesta: idPropuesta,
    }).first();

    if (!propuesta) {
      return {
        success: false,
        status: 404,
        message: "La propuesta no existe",
      };
    }

    //verificar que la propuestas le pertenezca al mismo cliente
    if (propuesta.idCliente !== idCliente) {
      return {
        success: false,
        status: 400,
        message: "La propuesta no pertenece al cliente especificado",
      };
    }

    //verificar que la prupuesta puede convertirse en proyecto
    // Verificar que la propuesta puede convertirse en proyecto
    if (propuesta.estado !== "aceptada") {
      return {
        success: false,
        status: 400,
        message: "La propuesta no puede convertirse en proyecto",
      };
    }

    // Verificar si la propuesta ya fue convertida en proyecto
    const proyectoExistente = await db.orm.public.Proyectos.where({
      idPropuesta: idPropuesta,
    }).first();

    if (proyectoExistente) {
      return {
        success: false,
        status: 409,
        message: "Esta propuesta ya fue convertida en proyecto anteriormente",
      };
    }
  }
  //si todo esta bien, creamos el proyecto
  const proyecto = await db.orm.public.Proyectos.create({
    idCliente: idCliente,
    idPropuesta: idPropuesta !== undefined ? idPropuesta : null,
    nombreProyecto: nombreProyecto.trim(),
    descripcion:
      descripcion !== undefined && descripcion !== null
        ? descripcion.trim()
        : null,
    fechaInicio: Temporal.PlainDate.from(fechaInicio),
    fechaFinEstimada:
      fechaFinEstimada !== undefined && fechaFinEstimada !== null
        ? Temporal.PlainDate.from(fechaFinEstimada)
        : null,
    estado: "planificacion",
  });

  return {
    success: true,
    message: "Proyecto creado correctamente",
    data: proyecto,
  };
}

//funcion para actualizar un proyecto
async function actualizarProyecto(
  id,
  { nombreProyecto, descripcion, fechaInicio, fechaFinEstimada, estado },
) {
  const proyecto = await db.orm.public.Proyectos.where({
    idProyecto: id,
  }).first();

  if (!proyecto) {
    return {
      success: false,
      status: 404,
      message: "Proyecto no encontrado",
    };
  }

  const nuevaFechaInicio =
    fechaInicio !== undefined
      ? Temporal.PlainDate.from(fechaInicio)
      : proyecto.fechaInicio;

  const nuevaFechaFinEstimada =
    fechaFinEstimada !== undefined
      ? fechaFinEstimada === null
        ? null
        : Temporal.PlainDate.from(fechaFinEstimada)
      : proyecto.fechaFinEstimada;

  // Validar relación entre fechas
  if (
    nuevaFechaFinEstimada !== null &&
    Temporal.PlainDate.compare(nuevaFechaFinEstimada, nuevaFechaInicio) < 0
  ) {
    return {
      success: false,
      status: 400,
      message: "La fechaFinEstimada no puede ser anterior a la fechaInicio",
    };
  }

  // Validar transición de estado
  if (estado !== undefined && estado !== proyecto.estado) {
    const transicionesPermitidas = {
      planificacion: ["en_progreso", "cancelado"],

      en_progreso: ["pausado", "finalizado", "cancelado"],

      pausado: ["en_progreso", "cancelado"],

      finalizado: [],

      cancelado: [],
    };

    const estadosPermitidos = transicionesPermitidas[proyecto.estado] || [];

    if (!estadosPermitidos.includes(estado)) {
      return {
        success: false,
        status: 400,
        message: `No se puede cambiar el estado de "${proyecto.estado}" a "${estado}"`,
      };
    }
  }

  // Construir únicamente los campos permitidos
  const datosActualizar = {};

  if (nombreProyecto !== undefined) {
    datosActualizar.nombreProyecto = nombreProyecto.trim();
  }

  if (descripcion !== undefined) {
    datosActualizar.descripcion =
      descripcion !== null ? descripcion.trim() : null;
  }
  if (fechaInicio !== undefined) {
    datosActualizar.fechaInicio = Temporal.PlainDate.from(fechaInicio);
  }

  if (fechaFinEstimada !== undefined) {
    datosActualizar.fechaFinEstimada =
      fechaFinEstimada === null
        ? null
        : Temporal.PlainDate.from(fechaFinEstimada);
  }

  if (estado !== undefined) {
    datosActualizar.estado = estado;
  }

  const proyectoActualizado = await db.orm.public.Proyectos.where({
    idProyecto: id,
  }).update(datosActualizar);

  return {
    success: true,
    message: "Proyecto actualizado correctamente",
    data: proyectoActualizado,
  };
}

//funcion para eliminar un proyecto
async function eliminarProyecto(id) {
  const proyecto = await db.orm.public.Proyectos.where({
    idProyecto: id,
  }).first();

  //si no existe el proyecto, devolvemos un error
  if (!proyecto) {
    return {
      success: false,
      status: 404,
      message: "Proyecto no encontrado",
    };
  }

  //verificamos asignaciones
  const asignaciones = await db.orm.public.Asignaciones.where({
    idProyecto: id,
  }).first();

  if (asignaciones) {
    return {
      success: false,
      status: 400,
      message:
        "No se puede eliminar el proyecto porque tiene asignaciones asociadas",
    };
  }

  //verificamos documentos
  const documentos = await db.orm.public.Documentos.where({
    idProyecto: id,
  }).first();

  if (documentos) {
    return {
      success: false,
      status: 400,
      message:
        "No se puede eliminar el proyecto porque tiene documentos asociados",
    };
  }

  //verificamos pagos
  const pagos = await db.orm.public.Pagos.where({
    idProyecto: id,
  }).first();

  //si tiene pagos asociados, no se puede eliminar
  if (pagos) {
    return {
      success: false,
      status: 400,
      message: "No se puede eliminar el proyecto porque tiene pagos asociados",
    };
  }

  //verificamos etapas
  const etapas = await db.orm.public.ProyectoEtapa.where({
    idProyecto: id,
  }).first();

  //si tiene etapas asociadas, no se puede eliminar
  if (etapas) {
    return {
      success: false,
      status: 400,
      message: "No se puede eliminar el proyecto porque tiene etapas asociadas",
    };
  }

  //verificamos servicios
  const servicios = await db.orm.public.ProyectoServicio.where({
    idProyecto: id,
  }).first();

  //si tiene servicios asociados, no se puede eliminar
  if (servicios) {
    return {
      success: false,
      status: 400,
      message:
        "No se puede eliminar el proyecto porque tiene servicios asociados",
    };
  }

  await db.orm.public.Proyectos.where({
    idProyecto: id,
  }).delete();

  return {
    success: true,
    message: "Proyecto eliminado correctamente",
  };
}

//exportar las funciones del servicio
module.exports = {
  obtenerProyectos,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
};

/**model Proyectos {
  idProyecto        Int                @id(map: "pk_proyectos") @default(autoincrement()) @map("id_proyecto")
  idCliente         Int                @map("id_cliente")
  idPropuesta       Int?               @map("id_propuesta")
  nombreProyecto    VarChar(150)       @map("nombre_proyecto")
  descripcion       String?
  fechaInicio       Date               @map("fecha_inicio")
  fechaFinEstimada  Date?              @map("fecha_fin_estimada")
  estado            VarChar(30)        @default("planificacion")
  asignaciones      Asignaciones[]
  documentos        Documentos[]
  pagos             Pagos[]
  proyectoEtapas    ProyectoEtapa[]
  proyectoServicios ProyectoServicio[]
  clientes          Clientes           @relation(fields: [idCliente], references: [idCliente], onDelete: Restrict, map: "fk_proyectos_cliente")
  propuestas        Propuestas?        @relation(fields: [idPropuesta], references: [idPropuesta], onDelete: SetNull, map: "fk_proyectos_propuesta")

  @@index([idCliente], map: "idx_proyectos_cliente")
  @@index([idPropuesta], map: "idx_proyectos_propuesta")
  @@check(expression: "((estado)::text = ANY ((ARRAY['planificacion'::character varying, 'en_progreso'::character varying, 'pausado'::character varying, 'finalizado'::character varying, 'cancelado'::character varying])::text[]))", map: "chk_proyectos_estado")
  @@check(expression: "((fecha_fin_estimada IS NULL) OR (fecha_fin_estimada >= fecha_inicio))", map: "chk_proyectos_fechas")
  @@map("proyectos")
} */
