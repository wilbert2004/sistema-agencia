//funcion para validar klos datos del metodo get
function ValidarObtenerTrabajadores(req, res, next) {
  next();
}

//funcion para validar los datos del metodo get por id
function ValidarObtenerTrabajadorPorId(req, res, next) {
  //VERIFICAR SI EL ID ES UN NUMERO
  const id = Number(req.params.id);

  //VERIFCAMOS QUE EL NUMERO SEA UIN INT YU QUE SEA MAYOR A 0
  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ error: "El ID debe ser un número entero mayor a 0" });
  }
  next();
}

function validarCrearTrabajador(req, res, next) {
  const { idUsuario, puesto } = req.body;

  // Validar que idUsuario sea un número entero positivo
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res
      .status(400)
      .json({ error: "El idUsuario debe ser un número entero mayor a 0" });
  }

  if (!puesto || typeof puesto !== "string" || puesto.trim() === 0) {
    return res.status(400).json({
      error: "El puesto es obligatorio y debe ser una cadena de texto",
    });
  }
  //el puesto no tiene que superar mas de 100 caracteres
  if (puesto.length > 100) {
    return res.status(400).json({
      error: "El puesto no puede superar los 100 caracteres",
    });
  }
  next();
}

//exportamos la funcion para validar la obtencion de un cliente
module.exports = {
  ValidarObtenerTrabajadores,
  ValidarObtenerTrabajadorPorId,
  validarCrearTrabajador,
};
