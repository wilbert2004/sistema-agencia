const proyectoServicioService = require("./proyecto-servicio.service");

//funcion para obtener todos los proyectos vinculados con servicio
async function obtenerProyectoServicio(req, res) {
  try {
    const result = await proyectoServicioService.obtenerProyectoServicio();
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error al obtener los proyectos vinculados con servicio:",
      error,
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener los proyectos vinculados con servicio",
      error: error.message,
    });
  }
}

//funcion para obtener los proyectos vinculados con servicio por id
async function obtenerProyectoServicioPorId(req, res) {
  try {
    const idProyecto = Number(req.params.idProyecto);
    const idServicio = Number(req.params.idServicio);
    const resultado =
      await proyectoServicioService.obtenerProyectoServicioPorId(
        idProyecto,
        idServicio,
      );

    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    res.status(200).json(resultado);
  } catch (error) {
    console.error(
      "Error al obtener el proyecto vinculado con servicio por id:",
      error,
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener el proyecto vinculado con servicio por id",
      error: error.message,
    });
  }
}

//funcion para crear un proyecto vinculado con servicio
async function crearProyectoServicio(req, res) {
  try {
    const { idProyecto, idServicio, cantidad, precioAcordado } = req.body;
    const resultado = await proyectoServicioService.crearProyectoServicio(
      idProyecto,
      idServicio,
      cantidad,
      precioAcordado,
    );

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear el proyecto vinculado con servicio:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el proyecto vinculado con servicio",
      error: error.message,
    });
  }
}

//funcion para actualizar un proyecto vinculado con servicio
async function actualizarProyectoServicio(req, res) {
  try {
    const idProyecto = Number(req.params.idProyecto);

    const idServicio = Number(req.params.idServicio);

    const { cantidad, precioAcordado } = req.body;

    const resultado = await proyectoServicioService.actualizarProyectoServicio(
      idProyecto,
      idServicio,
      {
        cantidad,
        precioAcordado,
      },
    );

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar proyecto-servicio:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para eliminar un proyecto vinculado con servicio
async function eliminarProyectoServicio(req, res) {
  try {
    const idProyecto = Number(req.params.idProyecto);

    const idServicio = Number(req.params.idServicio);

    const resultado = await proyectoServicioService.eliminarProyectoServicio(
      idProyecto,
      idServicio,
    );

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar proyecto-servicio:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para exportar los modulos
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
