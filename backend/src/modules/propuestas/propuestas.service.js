//importamos la bd con requiere
const { db } = require("../../config/database");

//funcion para obtener las proopuestas  asuyncronas
async function obtenerPropuestas() {
  const propuestas = await db.orm.public.Propuestas.select(
    //devolvemos los campos que queremos mostrar
    "idPropuesta",
    "idCliente",
    "nombre",
    "descripcion",
    "fechaCreacion",
    "fechaVencimiento",
    "subtotal",
    "impuestos",
    "total",
    "estado",
  ).first();

  //returnamos los valores
  return {
    success: true,
    mensaje: "Propuestas obtenidas correctamente",
    data: propuestas,
  };
}

//funcion para obtener una propuesta por id
async function obtenerPropuestaPorId(id) {
  const propuesta = await db.orm.public.Propuestas.select(
    "idPropuesta",
    "idCliente",
    "nombre",
    "descripcion",
    "fechaCreacion",
    "fechaVencimiento",
    "subtotal",
    "impuestos",
    "total",
    "estado",
  )
    .where({ idPropuesta: id })
    .first();

  if (!propuesta) {
    return {
      success: false,
      mensaje: "Propuesta no encontrada",
    };
  }

  return {
    success: true,
    mensaje: "Propuesta obtenida correctamente",
    data: propuesta,
  };
}

//funcion para crear una propuesta
async function crearPropuesta({
  idCliente,
  nombre,
  descripcion,
  fechaVencimiento,
}) {
  // Verificar que el cliente exista
  const cliente = await db.orm.public.Clientes.where({
    idCliente: idCliente,
  }).first();

  if (!cliente) {
    return {
      success: false,
      message: "El cliente no existe",
    };
  }

  // Crear propuesta
  const propuesta = await db.orm.public.Propuestas.create({
    idCliente: idCliente,
    nombre: nombre.trim(),
    descripcion:
      descripcion !== undefined && descripcion !== null
        ? descripcion.trim()
        : null,
    fechaVencimiento:
      fechaVencimiento !== undefined && fechaVencimiento !== null
        ? Temporal.PlainDate.from(fechaVencimiento)
        : null,
  });

  return {
    success: true,
    message: "Propuesta creada correctamente",
    data: propuesta,
  };
}

//funcion para actualizar una propuesta
async function actualizarPropuesta(
  id,
  { nombre, descripcion, fechaVencimiento, estado },
) {
  // Verificar que la propuesta exista
  const propuesta = await db.orm.public.Propuestas.where({
    idPropuesta: id,
  }).first();

  //si no existe la propuesta retornamos un error
  if (!propuesta) {
    return {
      success: false,
      message: "La propuesta no existe",
    };
  }
  //construir unicamente los campos requeridos
  const datosActualizar = {};

  //si el nombre es diferente de undefined
  if (nombre !== undefined) {
    datosActualizar.nombre = nombre.trim();
  }

  //si la descripcion es diferente de undefined
  if (descripcion !== undefined) {
    datosActualizar.descripcion =
      descripcion !== null ? descripcion.trim() : null;
  }
  //si la fecha de vencimiento es diferente de undefined
  if (fechaVencimiento !== undefined) {
    datosActualizar.fechaVencimiento =
      fechaVencimiento === null
        ? null
        : Temporal.PlainDate.from(fechaVencimiento);
  }
  //si el estado es diferente de undefined
  if (estado !== undefined) {
    datosActualizar.estado = estado;
  }

  //actualizamos la propuesta
  const propuestaActualizada = await db.orm.public.Propuestas.where({
    idPropuesta: id,
  }).update(datosActualizar);

  return {
    success: true,
    message: "Propuesta actualizada correctamente",
    data: propuestaActualizada,
  };
}

//fuyncion para eliminar una propuesta
async function eliminarPropuesta(id) {
  //validamos que la propuesta exista
  const propuesta = await db.orm.public.Propuestas.where({
    idPropuesta: id,
  }).first();

  //si no existe la propuesta retornamos un error
  if (!propuesta) {
    return {
      success: false,
      message: "propuesta no encontrada",
    };
  }

  //verificamos que la propesta si tiene detalle
  const detalle = await db.orm.public.PropuestaDetalle.where({
    idPropuesta: id,
  })
    .select()
    .first();

  //si tiene detalle no se puede eliminar
  if (detalle) {
    return {
      success: false,
      message:
        "No se puede eliminar la propuesta porque tiene detalles asociados",
    };
  }

  //verificar si esta relacionada con algun proyecto
  const proyecto = await db.orm.public.Proyectos.where({
    idPropuesta: id,
  })
    .select()
    .first();

  //si tiene proyecto no se puede eliminar
  if (proyecto) {
    return {
      success: false,
      message:
        "No se puede eliminar la propuesta porque está asociada a uno o más proyectos",
    };
  }

  //eliminamos la propuesta
  await db.orm.public.Propuestas.where({
    idPropuesta: id,
  }).delete();

  ///retornamos un mensaje de exito
  return {
    success: true,
    message: "Propuesta eliminada correctamente",
  };
}

module.exports = {
  obtenerPropuestas,
  obtenerPropuestaPorId,
  crearPropuesta,
  actualizarPropuesta,
  eliminarPropuesta,
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
