//validaremos que el nombre del rol no este vacio y que sea un string
function validarCrearRol(datos) {
  const errores = [];
  if (
    !datos.nombre ||
    typeof datos.nombre !== "string" ||
    datos.nombre.trim() === ""
  ) {
    errores.push("El nombre del rol es obligatorio y debe ser un string");
  }

  return errores;
}
//esportamos la funcion para validar la creacion de un rol
module.exports = {
  validarCrearRol,
};
