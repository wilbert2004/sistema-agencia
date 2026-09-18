//funcion para obtener todo los servicios que ofrece la empresa
function obtenerServicios(res, req, next) {
  next();
}

//funcion para obetner un servicio por id
function obtenerServicioPorId(req, res, next) {
  const id = Number(req.params.id);

  //validamos que el id sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del servicio debe ser un número entero positivo",
    });
  }
  //si es valido llamamos al next
  next();
}

//validacion para crear un servicio post
function validarCrearServicio(req, res, next) {
  //las propiedad de nuestra base de datos
  const { nombreServicio, descripcion, precioBase } = req.body;

  //verificamos  que nombreServicio no este indefinido
  if (nombreServicio === undefined) {
    //retornamos un error 400
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio es obligatorio",
    });
  }

  //verificamos que nombre servicio sea un string
  if (typeof nombreServicio !== "string") {
    //retornamos un error 400
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio debe ser un texto",
    });
  }
  //validamos que el nombre del servicio no supere los 100 caracteres
  if (nombreServicio.length > 100) {
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio no debe superar los 100 caracteres",
    });
  }

  //validamos que el nombre del servicio no este vacio
  if (nombreServicio.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio no debe estar vacío",
    });
  }

  //validacion de nuestro descripcion del servicio
  //verificacion que no sea indefinido nuestro descripcion
  if (descripcion === undefined && descripcion !== null) {
    //lanzamos un error 400
    return res.status(400).json({
      success: false,
      message:
        "La descripcion del servicio es obligatoria y el c ampo no debe de estar vacio ",
    });
  }

  //seguimos con la validacion de precio base del servicio
  //verificamos que precio base no este indefinido
  if (precioBase === undefined) {
    return res.status(400).json({
      success: false,
      message: "El precio base del servicio es obligatorio",
    });
  }

  //verificamos que precio base sea un numerro valido
  const precio = Number(precioBase);

  //validamos que precio base sea un numero positivo
  if (!Number.isFinite(precio)) {
    return res.status(400).json({
      success: false,
      message: "El precio base del servicio debe ser un número valido",
    });
  }

  //validamos que precio base sea un numero positivo
  if (precio < 0) {
    return res.status(400).json({
      success: false,
      message: "El precio base del servicio debe ser un número positivo",
    });
  }
  //si todo cumple pasamos con el next
  next();
}

//exportamos la funcion
module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  validarCrearServicio,
};
