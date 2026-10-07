const proyectoEtapaService = require("./proyecto-etapa.service");

//funcion para obtener todos los proyectos vinculados con etapa
async function obtenerProyectoEtapas(req, res) {
  try {
    const resultado = await proyectoEtapaService.obtenerProyectoEtapas();

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(
      "Error al obtener los proyectos vinculados con etapa:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Error del servidor interno",
      error: error.message,
    });
  }
}

//funcion para obtener un proyecto vinculado con etapa por id
async function obtenerProyectoEtapaPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const resultado = await proyectoEtapaService.obtenerProyectoEtapaPorId(id);

    if (!resultado.success) {
      return res.status(404).json({
        success: false,
        message: resultado.message,
      });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    console.error(
      "Error al obtener el proyecto vinculado con etapa por id:",
      error,
    );
    res.status(500).json({
      success: false,
      message: "Error del servidor interno",
      error: error.message,
    });
  }
}

//funcion para crear un proyecto vinculado con etapa
async function crearProyectoEtapa(req, res) {
  try {
    const { idProyecto, idEtapa, fechaInicio, fechaFin } = req.body;

    const resultado = await proyectoEtapaService.crearProyectoEtapa({
      idProyecto,
      idEtapa,
      fechaInicio,
      fechaFin,
    });

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear el proyecto vinculado con etapa:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor interno",
      error: error.message,
    });
  }
}

module.exports = {
  obtenerProyectoEtapas,
  obtenerProyectoEtapaPorId,
  crearProyectoEtapa,
};

/**propiedades de la bd 
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
