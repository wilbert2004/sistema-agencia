//validaciones de
function validarProyecto(req, res, next) {
  next();
}

//funcion para obtener proyectos por id
function validarProyectoPorId(req, res, next) {
  const id = Number(req.params.id);

  //verificamos que sea un numero positivo
  if (!Number.isInteger(id) || id <= 0) {
    //si no es un numero positivo, devolvemos un error
    return res.status(400).json({
      success: false,
      message: "El id del proyecto debe ser un número positivo",
    });
  }

  //si todo bien pasa al next
  next();
}

//funcion para validar la creacion de un proyecto
function validarCreacionProyecto(req, res, next) {
  const {
    idCliente,
    idPropuesta,
    nombreProyecto,
    descripcion,
    fechaInicio,
    fechaFinEstimada,
  } = req.body;

  //empezamos a validar los campos requeridos
  if (!Number.isInteger(idCliente) || idCliente <= 0) {
    return res.status(400).json({
      success: false,
      message: "El idCliente debe ser un entero positivo",
    });
  }

  //validamos que la propuesta sea opcional
  if (
    idPropuesta !== undefined &&
    idPropuesta !== null &&
    (!Number.isInteger(idPropuesta) || idPropuesta <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "El id de la propuesta debe ser un número positivo",
    });
  }

  //nombre de  proyecto
  if (
    typeof nombreProyecto !== "string" ||
    nombreProyecto.trim().length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "El nombreProyecto es obligatorio",
    });
  }

  const nombreNormalizado = nombreProyecto.trim();

  if (nombreNormalizado.length > 150) {
    return res.status(400).json({
      success: false,
      message: "El nombreProyecto no puede tener más de 150 caracteres",
    });
  }

  //validamos la descripcion opcional
  if (
    descripcion !== undefined &&
    descripcion !== null &&
    typeof descripcion !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "La descripcion debe ser una cadena de texto",
    });
  }

  //validaciuon de fecha vaciio
  if (
    typeof fechaInicio !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)
  ) {
    return res.status(400).json({
      success: false,
      message: "La fechaInicio debe tener el formato YYYY-MM-DD",
    });
  }

  //fecha fin estimada opcional
  if (
    fechaFinEstimada !== undefined &&
    fechaFinEstimada !== null &&
    (typeof fechaFinEstimada !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaFinEstimada))
  ) {
    return res.status(400).json({
      success: false,
      message: "La fechaFinEstimada debe tener el formato YYYY-MM-DD",
    });
  }

  // Validar que la fecha final no sea anterior
  // a la fecha de inicio
  if (fechaFinEstimada && fechaFinEstimada < fechaInicio) {
    return res.status(400).json({
      success: false,
      message: "La fechaFinEstimada no puede ser anterior a la fechaInicio",
    });
  }

  //si todo bien pasa al next
  next();
}

function validarActualizarProyecto(req, res, next) {
  // Validar que al menos un campo esté presente para actualizar
  const { nombreProyecto, descripcion, fechaInicio, fechaFinEstimada, estado } =
    req.body;

  // Debe venir al menos un campo para actualizar
  if (
    nombreProyecto === undefined &&
    descripcion === undefined &&
    fechaInicio === undefined &&
    fechaFinEstimada === undefined &&
    estado === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  // nombreProyecto
  if (nombreProyecto !== undefined) {
    if (
      typeof nombreProyecto !== "string" ||
      nombreProyecto.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "El nombreProyecto debe ser un texto válido",
      });
    }

    if (nombreProyecto.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: "El nombreProyecto no puede superar los 150 caracteres",
      });
    }
  }

  // descripcion
  if (
    descripcion !== undefined &&
    descripcion !== null &&
    typeof descripcion !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "La descripcion debe ser un texto",
    });
  }

  // fechaInicio
  if (fechaInicio !== undefined) {
    if (
      typeof fechaInicio !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)
    ) {
      return res.status(400).json({
        success: false,
        message: "La fechaInicio debe tener el formato YYYY-MM-DD",
      });
    }
  }

  // fechaFinEstimada
  if (fechaFinEstimada !== undefined && fechaFinEstimada !== null) {
    if (
      typeof fechaFinEstimada !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaFinEstimada)
    ) {
      return res.status(400).json({
        success: false,
        message: "La fechaFinEstimada debe tener el formato YYYY-MM-DD",
      });
    }
  }

  // estado
  if (estado !== undefined) {
    const estadosPermitidos = [
      "planificacion",
      "en_progreso",
      "pausado",
      "finalizado",
      "cancelado",
    ];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "El estado proporcionado no es válido",
      });
    }
  }

  next();
}

//funcion para eliminar un proyecto por id
function validarEliminarProyecto(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El idProyecto debe ser un entero positivo",
    });
  }

  next();
}

//importar las validaciones
module.exports = {
  validarProyecto,
  validarProyectoPorId,
  validarCreacionProyecto,
  validarActualizarProyecto,
  validarEliminarProyecto,
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
