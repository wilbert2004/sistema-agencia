//creacion de una funcion para mostrar en general las propuestas
function validarPropuesta(req, res, next) {
  //por seguridad no se requiere ningun id
  next();
}

//funcion para validarporpuestras por id }
function validarPropuestaPorId(req, res, next) {
  //jalamos la repuesta de id
  const id = Number(req.params.id);

  //validamos que el id sea un numero
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      mensaje: "El id de la propuesta debe ser un número válido",
    });
  }
  next();
}

//funcion para enviar datos en la base de datos
function validarCrearPropuesta(req, res, next) {
  //validamos que el body tenga los campos requeridos
  const { idCliente, nombre, descripcion, fechaVencimiento } = req.body;

  //empezamos a validar el campo de clientes con el id del cliente entero
  if (!Number.isInteger(idCliente) || idCliente <= 0) {
    return res.status(400).json({
      success: false,
      mensaje: "El id del cliente debe ser un número válido",
    });
  }

  //valimos el campo de nombre que sea un string y no este vacio
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({
      success: false,
      mensaje: "El nombre de la propuesta es requerido",
    });
  }

  //validamos que el nombre no sea mayor a 150 caracteres
  if (nombre.length > 150) {
    return res.status(400).json({
      success: false,
      mensaje: "El nombre de la propuesta no puede exceder los 150 caracteres",
    });
  }

  //validamos que la descripcion sea un string y no este vacio
  if (
    descripcion !== undefined &&
    typeof descripcion !== "string" &&
    descripcion !== null
  ) {
    return res.status(400).json({
      success: false,
      mensaje: "La descripción de la propuesta es requerida",
    });
  }

  //feha de vencimiento debe ser una fecha valida
  if (fechaVencimiento !== undefined && fechaVencimiento !== null) {
    if (
      typeof fechaVencimiento !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaVencimiento) ||
      Number.isNaN(new Date(fechaVencimiento).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "La fechaVencimiento debe tener el formato YYYY-MM-DD",
      });
    }
  }

  next();
}

//funcion para actualizar propuestas
function validarActualizarPropuesta(req, res, next) {
  //validamos que el body tenga los campos requeridos
  const { nombre, descripcion, fechaVencimiento, estado } = req.body;

  //validamos nombre
  if (nombre !== undefined && nombre.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: "El nombre no puede exceder los 150 caracteres",
    });
  }

  //descripcion validacion indefinido , nulo y tipo stying
  if (
    descripcion !== undefined &&
    descripcion !== null &&
    typeof descripcion !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "La descripción debe ser un texto válido",
    });
  }

  //fecha de vencimiento validacion indefinido , nulo y tipo string
  if (fechaVencimiento !== undefined && fechaVencimiento !== null) {
    if (
      typeof fechaVencimiento !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaVencimiento) ||
      Number.isNaN(new Date(fechaVencimiento).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "La fecha de vencimiento debe tener el formato YYYY-MM-DD",
      });
    }
  }

  //validamos el estado de la propuesta
  // estado
  if (estado !== undefined) {
    const estadosPermitidos = [
      "pendiente",
      "enviada",
      "aceptada",
      "rechazada",
      "vencida",
      "cancelada",
    ];

    if (typeof estado !== "string" || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "El estado de la propuesta no es válido",
      });
    }
  }

  next();
}

//funcion para eliminar propuestas
function validarEliminarPropuesta(req, res, next) {
  //jalmaos le id de nuestra propuestas
  const id = Number(req.params.id);

  //verificamos que el id sea un numero entero y mayor a 0
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      mensaje: "El id de la propuesta debe ser un número válido",
    });
  }
  //si todo esta bien pasamos al siguiente middleware
  next();
}

//exportamos las funciones de validacion de propuestas
module.exports = {
  validarPropuesta,
  validarPropuestaPorId,
  validarCrearPropuesta,
  validarActualizarPropuesta,
  validarEliminarPropuesta,
};

/**el modelado de la db 
 * model Propuestas {
  idPropuesta       Int                @id(map: "pk_propuestas") @default(autoincrement()) @map("id_propuesta")
  idCliente         Int                @map("id_cliente")
  nombre            VarChar(150)
  descripcion       String?
  fechaCreacion     Timestamp          @default(now()) @map("fecha_creacion")
  fechaVencimiento  Date?              @map("fecha_vencimiento")
  subtotal          Numeric(12, 2)     @default(0)
  impuestos         Numeric(12, 2)     @default(0)
  total             Numeric(12, 2)     @default(0)
  estado            VarChar(30)        @default("pendiente")
  propuestaDetalles PropuestaDetalle[]
  proyectos         Proyectos[]
  clientes          Clientes           @relation(fields: [idCliente], references: [idCliente], onDelete: Restrict, map: "fk_propuestas_cliente")

  @@index([idCliente], map: "idx_propuestas_cliente")
  @@check(expression: "((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'enviada'::character varying, 'aceptada'::character varying, 'rechazada'::character varying, 'vencida'::character varying, 'cancelada'::character varying])::text[]))", map: "chk_propuestas_estado")
  @@check(expression: "(impuestos >= (0)::numeric)", map: "chk_propuestas_impuestos")
  @@check(expression: "(subtotal >= (0)::numeric)", map: "chk_propuestas_subtotal")
  @@check(expression: "(total >= (0)::numeric)", map: "chk_propuestas_total")
  @@map("propuestas")
}
 */
