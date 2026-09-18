# Módulo de Especialidades (`ESPECIALIDADES.md`)

## Visión General

El módulo de especialidades gestiona el catálogo general de habilidades o áreas técnicas del sistema (`Especialidades`) y la relación de asignación con los trabajadores (`TrabajadorEspecialidad`).

La eliminación en este módulo opera mediante un **borrado físico condicional**: no se permite eliminar una especialidad si se encuentra asignada a uno o más trabajadores en la tabla pivote, protegiendo así la integridad referencial y evitando la pérdida accidental de historial operativo.

---

## Esquema de Base de Datos

- **`Especialidades`**:
- `id_especialidad` (Integer, PK): Identificador único de la especialidad (autoincrementable).
- `nombre_especialidad` (Varying Character 100, Unique): Nombre de la especialidad.

- **`TrabajadorEspecialidad`**:
- `id_trabajador` (Integer, PK/FK): Identificador del trabajador.
- `id_especialidad` (Integer, PK/FK): Identificador de la especialidad.

---

## Reglas de Negocio

- **Validación de Identificador (`:id`):** En todos los endpoints con parámetros de ruta, el `idEspecialidad` debe ser un número entero positivo mayor a cero.
- **Normalización de Nombres (`POST` y `PUT`):** Se aplica `.trim()` a `nombreEspecialidad` para eliminar espacios innecesarios al inicio o final. No se permiten nombres vacíos ni mayores a 100 caracteres.
- **Unicidad:** No se permite crear ni actualizar especialidades con nombres duplicados (evita redundancias como `"Backend"` y `" Backend "`).
- **Control de Borrado (`DELETE /api/especialidades/:id`):** Se verifica antes de eliminar si la especialidad está vinculada a registros en `TrabajadorEspecialidad`. Si tiene asignaciones activas, la petición se rechaza con un código HTTP `400 Bad Request`.
- **Manejo de Códigos HTTP:**
- **`200 OK`**: Solicitud procesada correctamente.
- **`201 Created`**: Especialidad creada exitosamente.
- **`400 Bad Request`**: Datos de entrada inválidos o la especialidad tiene dependencias asociadas.
- **`404 Not Found`**: La especialidad solicitada no existe.
- **`409 Conflict`**: El nombre de la especialidad ya se encuentra registrado.
- **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

## Endpoints de la API

| Método   | Endpoint                  | Descripción                                                              |
| -------- | ------------------------- | ------------------------------------------------------------------------ |
| `GET`    | `/api/especialidades`     | Obtiene el listado completo de especialidades ordenadas alfabéticamente. |
| `GET`    | `/api/especialidades/:id` | Obtiene la información detallada de una especialidad por su ID.          |
| `POST`   | `/api/especialidades`     | Registra una nueva especialidad en el catálogo.                          |
| `PUT`    | `/api/especialidades/:id` | Actualiza el nombre de una especialidad existente.                       |
| `DELETE` | `/api/especialidades/:id` | Elimina una especialidad si no tiene trabajadores asignados.             |

---

## Ejemplos de Petición / Respuesta

### `GET /api/especialidades`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idEspecialidad": 1,
      "nombreEspecialidad": "Desarrollo Web"
    },
    {
      "idEspecialidad": 2,
      "nombreEspecialidad": "Diseño UI/UX"
    }
  ]
}
```

---

### `GET /api/especialidades/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idEspecialidad": 1,
    "nombreEspecialidad": "Desarrollo Web"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "El idEspecialidad debe ser un entero positivo"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "Especialidad no encontrada"
}
```

---

### `POST /api/especialidades`

**Cuerpo de la Petición:**

```json
{
  "nombreEspecialidad": "  Base de Datos  "
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "message": "Especialidad creada correctamente",
  "data": {
    "idEspecialidad": 3,
    "nombreEspecialidad": "Base de Datos"
  }
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "Ya existe una especialidad con ese nombre"
}
```

---

### `PUT /api/especialidades/:id`

**Cuerpo de la Petición:**

```json
{
  "nombreEspecialidad": "Desarrollo Full Stack"
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Especialidad actualizada correctamente",
  "data": {
    "idEspecialidad": 1,
    "nombreEspecialidad": "Desarrollo Full Stack"
  }
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "Ya existe otra especialidad con ese nombre"
}
```

---

### `DELETE /api/especialidades/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Especialidad eliminada correctamente",
  "data": {
    "idEspecialidad": 3,
    "nombreEspecialidad": "Base de Datos"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "No se puede eliminar la especialidad porque está asignada a uno o más trabajadores"
}
```
