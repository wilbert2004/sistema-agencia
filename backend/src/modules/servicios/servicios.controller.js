//requerimos el modelo de servicios
const serviciosService = require("./servicios.service");

//funcion para obtener todos los servicios
async function obtenerServicios(req, res) {
  try {
    const resultado = await serviciosService.obtenerServicios();
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para obtener un servicio por id
async function obtenerServicioPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const resultado = await serviciosService.obtenerServicioPorId(id);
    //vericamos la condicion de success false para mandar un error 404
    if (!resultado.success) {
      return res.status(404).json(resultado);
    }
    //si todo bien mandamos un success true y un mensaje de que se obtuvo el servicio
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener servicio por id:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para crear un servicio
async function crearServicio(req, res) {
  try {
    //obtenemos todo las propiedades del body
    const { nombreServicio, descripcion, precioBase } = req.body;

    const resultado = await serviciosService.crearServicio(
      nombreServicio,
      descripcion,
      precioBase,
    );
    //si el resultado es success false mandamos un error 400
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }

    //si no mandamos un success true y un mensaje de que se creo el servicio
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para actualizar un servicio
async function actualizarServicio(req, res) {
  try {
    //obtenemos el id del servicio
    const id = Number(req.params.id);

    //obtenemos todo las propiedades del body
    const { nombreServicio, descripcion, precioBase } = req.body;

    const resultado = await serviciosService.actualizarServicio(
      id,
      nombreServicio,
      descripcion,
      precioBase,
    );

    //vericamos que el servicio en dado caso que no se encuentre
    if (!resultado.success) {
      if (resultado.message === "El servicio no existe") {
        return res.status(404).json(resultado);
      }
    }

    //condicion de verificar si el nombre del servicio ya existe en otro servicio
    if (!resultado.success) {
      if (
        resultado.message ===
        "El nombre del servicio ya existe en otro servicio"
      ) {
        return res.status(409).json(resultado);
      }
    }

    //si todo bien mandamos un success true y un mensaje de que se actualizo el servicio
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para eliminar un servicio
async function eliminarServicio(req, res) {
  try {
    //obtenemos el id del servicio
    const id = Number(req.params.id);
    const resultado = await serviciosService.eliminarServicio(id);

    //vericamos que el servicio en dado caso que no se encuentre
    if (!resultado.success) {
      if (resultado.message === "El servicio no existe") {
        return res.status(404).json(resultado);
      }
    }

    //vefioficamso que no esta usando el servicio en especialidades
    if (
      resultado.message === "El servicio esta siendo usado en propuestas" ||
      resultado.message === "El servicio esta siendo usado en un proyecto"
    ) {
      return res.status(409).json(resultado);
    }

    //si todo bien mandamos un success true y un mensaje de que se elimino el servicio
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}
//exportamos las funciones
module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};
