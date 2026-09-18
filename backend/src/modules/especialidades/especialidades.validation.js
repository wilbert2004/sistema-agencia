function validarObtenerEspecialidades(req, res, next) {
  next();
}

//funcion para validar el id de la especialidad
function validarObtenerEspecialidadPorId(req, res, next) {
  //obtenemos el id de la especialidad
  const id = Number(req.params.id);

  //validamos que el id sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    //retornamos
    return {
      valido: false,
      status: 400,
      message: "El ID de la especialidad debe ser un número entero positivo",
    };
  }

  //si es valido llamamos al next
  next();
}

//funcion para crear una especialidad con un post
function validarCrearEspecialidad(req, res, next) {
  //declaramos esta variables para validar que el nombre de la especialidad no este vacio
  const { nombreEspecialidad } = req.body;

  //verificamos que el nombre de la especialidad no este indefinido
  if (nombreEspecialidad === undefined) {
    //returnamos un error 400
    return res.status(400).json({
      success: false,
      message: "El nombre de la especialidad es obligatorio",
    });
  }

  //verificamos que el nombre que se mande sea un string
  if (typeof nombreEspecialidad !== "string") {
    //returnamos un error 400
    return res.status(400).json({
      success: false,
      message: "El nombre de la especialidad debe ser un string",
    });
  }

  //validamos que sea una cadena no mayor a 100
  if (nombreEspecialidad.length > 100) {
    return res.status(400).json({
      success: false,
      message:
        "El nombre de la especialidad no debe ser mayor a 100 caracteres",
    });
  }

  //validamos que no sea campos vacios
  if (nombreEspecialidad.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la especialidad no debe estar vacío",
    });
  }
  //si todo bien llamamos al next
  next();
}

//funcion para actualizar una especialidad con un put
function validarActualizarEspecialidad(req, res, next) {
  //declaramos esta variables para validar que el nombre de la especialidad no este vacio
  const { nombreEspecialidad } = req.body;

  //verificamos que el nombre no este indefinido
  if (nombreEspecialidad === undefined) {
    //returnamos un error 400
    return res.status(400).json({
      success: false,
      message: "El nombre de la especialidad es obligatorio",
    });
  }

  //verificamos que el nombre que se mande sea un string
  if (typeof nombreEspecialidad !== "string") {
    //returnamos un error 400
    return res.status(400).json({
      success: false,
      message: "El nombre de la especialidad debe ser un string",
    });
  }

  //validamos que sea una cadena no mayor a 100
  if (nombreEspecialidad.length > 100) {
    return res.status(400).json({
      success: false,
      message:
        "El nombre de la especialidad no debe ser mayor a 100 caracteres",
    });
  }

  //validamos que no sea campos vacios
  if (nombreEspecialidad.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "El nombre de la especialidad no debe estar vacío",
    });
  }

  //si todo bien llamamos al next
  next();
}

//funcion para delete
function validarEliminarEspecialidad(req, res, next) {
  //obtenemos el id de la especialidad
  const id = Number(req.params.id);

  //validamos que el id sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    //retornamos
    return {
      valido: false,
      status: 400,
      message: "El ID de la especialidad debe ser un número entero positivo",
    };
  }
  //si es valido llamamos al next
  next();
}

//exportamos las funciones de validacion
module.exports = {
  validarObtenerEspecialidades,
  validarObtenerEspecialidadPorId,
  validarCrearEspecialidad,
  validarActualizarEspecialidad,
  validarEliminarEspecialidad,
};
