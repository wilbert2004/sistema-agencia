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

//validacion para actualizar un servcio put
function validarActualizarServicio(req, res, next) {
  //verificamos que el id sea un numero entero positivo
  const id = Number(req.params.id);

  //veficamos el el id proporcionado sea un id
  if (!Number.isInteger(id) || id <= 0) {
    //devolvemos un 400 si esta mal dentro de un json
    return res.status(400).json({
      success: false,
      message: "El ID del servicio debe ser un número entero positivo",
    });
  }

  //declaramos las variables de la propidad de nuestrp servicio
  const { nombreServicio, descripcion, precioBase } = req.body;

  //validamos el nombre de servicio qu eno sea indefinido
  if (nombreServicio === undefined) {
    //returnmos el valor de 400
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio es obligatorio",
    });
  }

  //validamos que el nombre servicio sea un texto
  if (typeof nombreServicio !== "string") {
    //lanzamzo un error 4000 con un json response
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio debe ser un texto",
    });
  }

  //verifamcos que el dato no sea vacio
  if (nombreServicio.trim().length === 0) {
    //lanzamos un error 400 con un json response
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio no debe estar vacío",
    });
  }

  //validamos que el nombre del servicio no supere los 100 caracteres
  if (nombreServicio.length > 100) {
    return res.status(400).json({
      success: false,
      message: "El nombre del servicio no debe superar los 100 caracteres",
    });
  }

  //validamos la condiicon de descripcion
  //valicacion que no sea indefinido y tampoco vacio
  if (descripcion === undefined && descripcion !== null) {
    //dentro del if validamos que tipo de dato sea un string
    if (typeof descripcion !== "string") {
      //lanzamos un error
      return res.status(400).json({
        success: false,
        message: "la descripcin del servicio debe ser un texto y no vacio ",
      });
    }
  }

  //valimos el precio base que sea un numero obligatorio
  if (precioBase === undefined) {
    return res.status(400).json({
      success: false,
      message: "El precio base del servicio es obligatorio",
    });
  }
  //valiamos que sea un numero valido
  const precio = Number(precioBase);
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

//funcion para eliminar un servicio
function validarEliminarServicio(req, res, next) {
  //validamos que el id sea un numero entero positivo
  const id = Number(req.params.id);

  //verificamos que el id sea un numero entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del servicio debe ser un número entero positivo",
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
  validarActualizarServicio,
  validarEliminarServicio,
};
