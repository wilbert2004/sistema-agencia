//crearemos la funcion con next sin tantos restricciones para que pueda ser usada en cualquier ruta

function validarObtenerclientes(req, res, next) {
  next();
}
//creamos la validacion de datos del cliente

function validarObtenerClientesId(req, res, next) {
  //validamos que el id sea un numero entero positivo
  const id = Number(req.params.id);
  //validamos que el id sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del cliente debe ser un número entero positivo",
    });
  }
  next();
}

//crearemos restricciones para validar la informacion que se envia al bd
function validarCrearCliente(req, res, next) {
  const { idUsuario, empresa, telefono, direccion } = req.body;

  //validaremos que el idUsuario sea un numero entero positivo
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del usuario debe ser un número entero positivo",
    });
  }
  //validaremos que la empresa sea un string y que tenga al menos 1 caracter
  if (!empresa || typeof empresa !== "string" || empresa.trim().length < 1) {
    //devolvemos el error 400 con un mensaje de error
    return res.status(400).json({
      success: false,
      message: "La empresa es obligatoria y debe tener al menos 1 caracter",
    });
  }

  //validaremso el tipo telefono que sea un string y que tenga al menos 10 caracteres
  if (
    !telefono ||
    typeof telefono !== "string" ||
    telefono.trim().length < 10
  ) {
    //devolvemos el error 400 con un mensaje de error
    return res.status(400).json({
      success: false,
      message: "El telefono es obligatorio y debe tener al menos 10 caracteres",
    });

    //validaremos la direccion que sea un string y que tenga al menos 5 caracteres
  } else if (
    !direccion ||
    typeof direccion !== "string" ||
    direccion.trim().length < 5
  ) {
    //devolvemos el error 400 con un mensaje de error
    return res.status(400).json({
      success: false,
      message: "La direccion es obligatoria y debe tener al menos 5 caracteres",
    });
  }
  next();
}
//validacion de datos del metodo put
function validarActualizarCliente(req, res, next) {
  const { empresa, telefono, direccion } = req.body;
  if (
    empresa !== undefined &&
    telefono !== undefined &&
    direccion !== undefined
  ) {
    //un json debe tener al menos un campo para actualizar
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  //validaremos que la empresa sea un string y que tenga al menos 1 caracter
  if (
    empresa !== undefined &&
    (typeof empresa !== "string" || empresa.trim().length < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "La empresa debe ser un string y tener al menos 1 caracter",
    });
  }

  //validaremos que el telefono sea un string y que tenga al menos 10 caracteres
  if (
    telefono !== undefined &&
    (typeof telefono !== "string" || telefono.trim().length < 10)
  ) {
    return res.status(400).json({
      success: false,
      message: "El telefono debe ser un string y tener al menos 10 caracteres",
    });
  }

  //validaremos que la direccion sea un string y que tenga al menos 5 caracteres
  if (
    direccion !== undefined &&
    (typeof direccion !== "string" || direccion.trim().length < 5)
  ) {
    return res.status(400).json({
      success: false,
      message: "La direccion debe ser un string y tener al menos 5 caracteres",
    });
  }

  next();
}
//exportamos la funcion para validar la obtencion de un cliente
module.exports = {
  validarObtenerclientes,
  validarObtenerClientesId,
  validarCrearCliente,
  validarActualizarCliente,
};
