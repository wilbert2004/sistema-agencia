function validarCrearUsuario(datos) {
  const errores = [];

  // Validar que los campos requeridos estén presentes y sean del tipo correcto
  if (!datos.nombre || typeof datos.nombre !== "string") {
    errores.push("El nombre es obligatorio");
  } else if (datos.nombre.trim().length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres");
  }

  // Validar que el correo sea un correo electrónico válido
  if (!datos.correo || typeof datos.correo !== "string") {
    errores.push("El correo es obligatorio");
  } else {
    // Validar que el correo tenga un formato válido
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoValido.test(datos.correo)) {
      errores.push("El correo no es válido");
    }
  }

  //validar que el rol sea obligatorio y que sea un número entero
  if (!datos.idRol || !Number.isInteger(Number(datos.idRol))) {
    errores.push("El rol es obligatorio");
  }

  //validar que la contraseña sea obligatoria y que tenga al menos 6 caracteres
  if (!datos.contrasena || typeof datos.contrasena !== "string") {
    errores.push("La contraseña es obligatoria");
  } else if (datos.contrasena.trim().length < 6) {
    errores.push("La contraseña debe tener al menos 6 caracteres");
  }

  return errores;
}

//crearemos una funcuioin  para validdar actualizacion de usuarios
function validarActualizarUsuario(datos) {
  const errores = [];

  //validaremso el nombre que no esta idefinido
  if (datos.nombre !== undefined) {
    if (typeof datos.nombre !== "string" || datos.nombre.trim().length < 3) {
      errores.push("El nombre debe ser tener al; menos 3 caracteres");
    }
  }

  //validaremos que el correo no este indefinido
  if (datos.correo !== undefined) {
    //validaremsoq ue eel correo sea struing y que tenga un formato valido
    if (typeof datos.correo !== "string") {
      errores.push("El correo no es valido");
    } else {
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoValido.test(datos.correo)) {
        errores.push("El correo no es valido");
      }
    }
  }

  //validaremso que el rol no esta indefinio
  if (datos.idRol !== undefined) {
    if (!Number.isInteger(Number(datos.idRol)) || datos.idRol <= 0) {
      errores.push("El rol debe ser un número entero positivo");
    }
  }

  //validaremos que ele datos esta activo
  if (datos.activo !== undefined && typeof datos.activo !== "boolean") {
    errores.push("El campo activo debe ser un valor booleano");
  }
  return errores;
}

module.exports = {
  validarCrearUsuario,
  validarActualizarUsuario,
};
