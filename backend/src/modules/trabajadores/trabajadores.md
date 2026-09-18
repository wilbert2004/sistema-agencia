# Módulo de Trabajadores (`TRABAJADORES.md`)

## Visión General

Este módulo gestiona la información laboral y profesional de los empleados de la empresa. Mantiene una relación $1:1$ única (`@unique`) con la tabla `Usuarios`: la entidad `Trabajadores` almacena el `puesto` del empleado, mientras que `Usuarios` gestiona sus credenciales, nombre, correo y rol (`idRol = 2`).

---

## Esquema de Base de Datos (Prisma Model: `Trabajadores`)

- `idTrabajador` (`Int`, PK, Autoincrement): Identificador del perfil de trabajador (`id_trabajador`).
- `idUsuario` (`Int`, FK, Unique): Relación $1:1$ con el modelo `Usuarios` (`onDelete: Restrict`).
- `puesto` (`VarChar(100)`): Puesto o cargo laboral del trabajador (obligatorio).

---

## Reglas de Negocio

- **Pertenencia de Rol:** Un registro en `Trabajadores` solo puede crearse si el `idUsuario` asociado existe, está activo (`activo: true`) y tiene asignado el rol de Trabajador (`idRol: 2`).
- **Unicidad:** Un usuario solo puede tener un único perfil en la tabla `Trabajadores` (`@unique`).
- **Autogeneración:** El `idTrabajador` es gestionado automáticamente por la base de datos y no debe ser enviado en el cuerpo de las peticiones.

---

## Endpoints de la API

| Método   | Endpoint                | Descripción                                                  | Estado        |
| -------- | ----------------------- | ------------------------------------------------------------ | ------------- |
| `GET`    | `/api/trabajadores`     | Obtiene el listado de todos los trabajadores.                | ✅ Completado |
| `GET`    | `/api/trabajadores/:id` | Obtiene el detalle de un trabajador por su `idTrabajador`.   | ✅ Completado |
| `POST`   | `/api/trabajadores`     | Registra el perfil laboral de un usuario con `idRol: 2`.     | ✅ Completado |
| `PUT`    | `/api/trabajadores/:id` | Actualiza el puesto del trabajador.                          | ⏳ Pendiente  |
| `DELETE` | `/api/trabajadores/:id` | Ejecuta la baja lógica desactivando la cuenta en `Usuarios`. | ⏳ Pendiente  |

---

## Ejemplos de Petición / Respuesta

### `GET /api/trabajadores`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idTrabajador": 1,
      "idUsuario": 5,
      "puesto": "Desarrollador Frontend"
    }
  ]
}
```

---

### `GET /api/trabajadores/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idTrabajador": 1,
    "idUsuario": 5,
    "puesto": "Desarrollador Frontend"
  }
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "mensaje": "Trabajador no encontrado"
}
```

---

### `POST /api/trabajadores`

**Cuerpo de la Petición:**

```json
{
  "idUsuario": 5,
  "puesto": "Desarrollador Frontend"
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "mensaje": "Trabajador creado correctamente",
  "data": {
    "idTrabajador": 1,
    "idUsuario": 5,
    "puesto": "Desarrollador Frontend"
  }
}
```

**Respuestas de Error:**

- **`400 Bad Request`**: El usuario no tiene rol de trabajador (`idRol !== 2`), el usuario está inactivo o el campo `puesto` es inválido.
- **`404 Not Found`**: El `idUsuario` proporcionado no existe.
- **`409 Conflict`**: El usuario ya posee un perfil de trabajador registrado.

* **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

¡Excelente trabajo por hoy! Mañana continúas con el `PUT` y `DELETE` para cerrar este módulo.
