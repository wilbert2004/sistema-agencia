# Módulo de Trabajador-Especialidad (`TRABAJADOR_ESPECIALIDAD.md`)

## Visión General

El módulo de asignación gestiona la relación intermedia (tabla pivote) entre los trabajadores y las especialidades del sistema (`TrabajadorEspecialidad`).

Al ser una tabla de unión pura con clave primaria compuesta (`idTrabajador`, `idEspecialidad`), no maneja atributos propios ni requiere operaciones de actualización (`PUT`). La modificación de competencias se realiza desasociando una relación existente y creando una nueva. La eliminación opera mediante un **borrado físico de la relación**, permitiendo desvincular una especialidad de un trabajador sin alterar el catálogo general ni el registro del trabajador.

---

## Esquema de Base de Datos

- **`TrabajadorEspecialidad`**:
  - `id_trabajador` (Integer, PK/FK): Identificador único del trabajador (referencia a la tabla `Trabajadores`).
  - `id_especialidad` (Integer, PK/FK): Identificador único de la especialidad (referencia a la tabla `Especialidades`).

---

## Reglas de Negocio

- **Validación de Identificadores (`:idTrabajador` / `:idEspecialidad`):** En todos los endpoints con parámetros de ruta o cuerpo de la petición, los identificadores deben ser números enteros positivos mayores a cero.
- **Existencia y Estado del Trabajador (`POST`):** Antes de crear una asignación, se valida que el trabajador exista en la base de datos y que su usuario asociado se encuentre en estado activo (`activo = true`).
- **Existencia de la Especialidad (`POST`):** Se verifica que la especialidad exista previamente en el catálogo (`Especialidades`).
- **Prevención de Duplicados (`POST`):** No se permite registrar dos veces la misma combinación de `idTrabajador` e `idEspecialidad`. Si la relación ya existe, responde con un código HTTP `409 Conflict`.
- **Control de Desasociación (`DELETE`):** Se verifica la existencia previa de la relación compuesta antes de eliminarla. Si la relación no existe, la petición responde con `404 Not Found`.
- **Manejo de Códigos HTTP:**
  - **`200 OK`**: Solicitud procesada correctamente.
  - **`201 Created`**: Especialidad asignada al trabajador exitosamente.
  - **`400 Bad Request`**: Parámetros inválidos o el usuario asignado al trabajador se encuentra inactivo.
  - **`404 Not Found`**: El trabajador, la especialidad o la relación compuesta no existen.
  - **`409 Conflict`**: La especialidad ya se encuentra asignada al trabajador.
  - **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

## Endpoints de la API

| Método   | Endpoint                                                     | Descripción                                                                |
| -------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `GET`    | `/api/trabajador-especialidad`                               | Obtiene el listado completo de asignaciones registradas en el sistema.     |
| `GET`    | `/api/trabajador-especialidad/trabajador/:idTrabajador`      | Obtiene las especialidades asignadas a un trabajador específico por su ID. |
| `POST`   | `/api/trabajador-especialidad`                               | Asigna una especialidad a un trabajador activo.                            |
| `DELETE` | `/api/trabajador-especialidad/:idTrabajador/:idEspecialidad` | Elimina la relación específica entre un trabajador y una especialidad.     |

---

## Ejemplos de Petición / Respuesta

### `GET /api/trabajador-especialidad`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idTrabajador": 2,
      "idEspecialidad": 1,
      "nombreEspecialidad": "Desarrollo Web"
    },
    {
      "idTrabajador": 2,
      "idEspecialidad": 3,
      "nombreEspecialidad": "Base de Datos"
    },
    {
      "idTrabajador": 5,
      "idEspecialidad": 2,
      "nombreEspecialidad": "Diseño UI/UX"
    }
  ]
}
```

---

### `GET /api/trabajador-especialidad/trabajador/:idTrabajador`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idTrabajador": 2,
    "especialidades": [
      {
        "idEspecialidad": 1,
        "nombreEspecialidad": "Desarrollo Web"
      },
      {
        "idEspecialidad": 3,
        "nombreEspecialidad": "Base de Datos"
      }
    ]
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "El idTrabajador debe ser un entero positivo"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "Trabajador no encontrado"
}
```

---

### `POST /api/trabajador-especialidad`

**Cuerpo de la Petición:**

```json
{
  "idTrabajador": 2,
  "idEspecialidad": 3
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "message": "Especialidad asignada correctamente al trabajador",
  "data": {
    "idTrabajador": 2,
    "idEspecialidad": 3
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "No se puede asignar especialidades a un trabajador inactivo"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "El trabajador o la especialidad no existen"
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "El trabajador ya tiene asignada esta especialidad"
}
```

---

### `DELETE /api/trabajador-especialidad/:idTrabajador/:idEspecialidad`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Especialidad desasociada del trabajador correctamente",
  "data": {
    "idTrabajador": 2,
    "idEspecialidad": 3
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "Los identificadores deben ser enteros positivos"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "No existe la relación especificada entre el trabajador y la especialidad"
}
```
