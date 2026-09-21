//validacion para etapas
function ValidadEtapas(req, res, next) {
  next();
}

//validacion para buscar id de etapa en especifico
function ValidadEtapaId(req, res, next) {
  //validacion para buscar id de etapa en especifico
  const id = Number(req.params.id);

  //verificamos que el id sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID de la etapa debe ser un número entero positivo",
    });
  }
  //si todo cumple pasamos con el next
  next();
}

//funcion para validar la creacion de un etapa
function validarCrearEtapa(req, res, next) {
  //jalamos las propiedades del body\
  const { nombreEtapa, descripcion } = req.body;

  //validamos que el nombre no este indefinido
  if (nombreEtapa === undefined) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa es obligatorio",
    });
  }

  //validamos que el nombre sea un string
  if (typeof nombreEtapa !== "string") {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa debe ser un texto",
    });
  }

  //validamos que el nombre etapa no este vacio
  if (nombreEtapa.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa no puede estar vacío",
    });
  }

  //validasmos que nu supere los 100 caracteres
  if (nombreEtapa.length > 100) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa no debe superar los 100 caracteres",
    });
  }

  //validamos que la descripcion no sea indefinido ni nulo
  if (descripcion !== undefined && descripcion !== null) {
    //luego de valiodar que no sea indefinido ni nulo verificamos que sea un string
    if (typeof descripcion !== "string") {
      return res.status(400).json({
        success: false,
        message: "La descripción de la etapa debe ser un texto",
      });
    }
  }
  next();
}

//funcion para validar la actualizacion de una etapa
function validarActualizarEtapa(req, res, next) {
  //verificamos el id de al etapa que se quiere actualizar
  const id = Number(req.params.id);

  //validamos que sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID de la etapa debe ser un número entero positivo",
    });
  }

  //jalamos las propiedades del body
  const { nombreEtapa, descripcion } = req.body;

  //validamos que el nombre no este indefinido
  if (nombreEtapa === undefined) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa es obligatorio",
    });
  }

  //validamos que el nombre sea un string
  if (typeof nombreEtapa !== "string") {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa debe ser un texto",
    });
  }
  //validamos que el nombre etapa no este vacio
  if (nombreEtapa.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa no puede estar vacío",
    });
  }
  //validasmos que nu supere los 100 caracteres
  if (nombreEtapa.length > 100) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la etapa no debe superar los 100 caracteres",
    });
  }

  //validamos que la descripcion no sea indefinido ni nulo
  if (descripcion !== undefined && descripcion !== null) {
    //luego de valiodar que no sea indefinido ni nulo verificamos que sea un string
    if (typeof descripcion !== "string") {
      return res.status(400).json({
        success: false,
        message: "La descripción de la etapa debe ser un texto",
      });
    }
  }

  //si todo cumple pasamos con el next
  next();
}

//funcion para eliminar una etapa
function validarEliminarEtapa(req, res, next) {
  //verificamos el id de al etapa que se quiere eliminar
  const id = Number(req.params.id);

  //validamos que sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID de la etapa debe ser un número entero positivo",
    });
  }
  //si todo cumple pasamos con el next
  next();
}

module.exports = {
  ValidadEtapas,
  ValidadEtapaId,
  validarCrearEtapa,
  validarActualizarEtapa,
  validarEliminarEtapa,
};

/**propiedad de la base de datos de etapa 
 * model Etapas {
  idEtapa        Int             @id(map: "pk_etapas") @default(autoincrement()) @map("id_etapa")
  nombreEtapa    VarChar(100)    @unique(map: "uq_etapas_nombre") @map("nombre_etapa")
  descripcion    String?
  proyectoEtapas ProyectoEtapa[]

  @@map("etapas")
}
 */
