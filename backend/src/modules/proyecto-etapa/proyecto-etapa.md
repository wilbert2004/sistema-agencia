# Módulo de Proyecto-Etapa (`PROYECTO_ETAPA.md`)

## Visión General

El módulo de fases por proyecto gestiona la asignación y el ciclo de vida operacional de las distintas etapas asociadas a un proyecto (`ProyectoEtapa`).

A diferencia de las tablas pivote con clave compuesta, esta entidad cuenta con un identificador único autoincrementable (`idProyectoEtapa`), así como con el control de fechas (`fechaInicio`, `fechaFin`) y el seguimiento de estados (`pendiente`, `en_progreso`, `completada`, `cancelada`). Permite la actualización (`PUT`) de su ciclo de vida y sus fechas, pero **mantiene protegidas las llaves foráneas** (`idProyecto` e `idEtapa`) para asegurar la coherencia del historial operacional.

---

## Esquema de Base de Datos

- **`ProyectoEtapa`**:
- `id_proyecto_etapa` (Integer, PK): Identificador único de la asignación de etapa (autoincrementable).
- `id_proyecto` (Integer, FK): Identificador del proyecto (referencia a `Proyectos`).
- `id_etapa` (Integer, FK): Identificador de la etapa (referencia a `Etapas`).
- `fecha_inicio` (Date): Fecha de inicio programada o real de la etapa.
- `fecha_fin` (Date, Opcional): Fecha de finalización estimada o real (`fecha_fin >= fecha_inicio`).
- `estado` (Varying Character 30, Default `'pendiente'`): Estado del flujo operacional de la etapa.

---

## Reglas de Negocio y Transiciones de Estado

- **Validación de Identificador (`:id`):** En todos los endpoints con parámetros de ruta, el `idProyectoEtapa` debe ser un entero positivo mayor a cero.
- **Existencia de Entidades (`POST`):** Se verifica la existencia previa del `idProyecto` en la tabla `Proyectos` y del `idEtapa` en la tabla `Etapas`.
- **Prevención de Etapas Duplicadas (`POST`):** Una misma etapa no puede registrarse dos veces dentro del mismo proyecto. Si ya existe, responde con `409 Conflict`.
- **Reglas de Fechas (`POST` y `PUT`):**
- `fechaInicio` es obligatoria en la creación.
- Si se proporciona `fechaFin`, debe ser mayor o igual a `fechaInicio` (`fechaFin >= fechaInicio`).

- **Control de Estado Inicial (`POST`):**
- Toda nueva etapa se registra automáticamente con el estado `'pendiente'`. El cliente no puede forzar un estado inicial diferente en la creación.

- **Máquina de Estados y Transiciones (`PUT`):**
- Los únicos estados válidos son: `'pendiente'`, `'en_progreso'`, `'completada'` y `'cancelada'`.
- **Transiciones permitidas:**
- `pendiente` $\rightarrow$ `en_progreso` o `cancelada`.
- `en_progreso` $\rightarrow$ `completada` o `cancelada`.

- **Transiciones no permitidas:** No se permite reabrir etapas cerradas (`completada` o `cancelada`). Responderá con `400 Bad Request`.

- **Inmutabilidad de Llaves (`PUT`):** No se permite actualizar los campos `idProyecto` e `idEtapa`.
- **Control de Eliminación (`DELETE`):** Se elimina el registro en `ProyectoEtapa`, dejando intactos el proyecto principal y el catálogo general de etapas.
- **Manejo de Códigos HTTP:**
- **`200 OK`**: Solicitud procesada correctamente.
- **`201 Created`**: Etapa asignada al proyecto exitosamente.
- **`400 Bad Request`**: Datos de entrada inválidos, error en la coherencia de fechas o transición de estado no permitida.
- **`404 Not Found`**: El proyecto, la etapa o el registro de `ProyectoEtapa` no existen.
- **`409 Conflict`**: La etapa ya se encuentra registrada en el proyecto.
- **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

## Endpoints de la API

| Método   | Endpoint                  | Descripción                                                                 |
| -------- | ------------------------- | --------------------------------------------------------------------------- |
| `GET`    | `/api/proyecto-etapa`     | Obtiene el listado completo de etapas asignadas a proyectos.                |
| `GET`    | `/api/proyecto-etapa/:id` | Obtiene el detalle de un registro específico por su `idProyectoEtapa`.      |
| `POST`   | `/api/proyecto-etapa`     | Registra una nueva etapa para un proyecto con estado inicial `'pendiente'`. |
| `PUT`    | `/api/proyecto-etapa/:id` | Actualiza las fechas o el estado respetando las reglas de transición.       |
| `DELETE` | `/api/proyecto-etapa/:id` | Elimina una etapa del proyecto.                                             |

---

## Ejemplos de Petición / Respuesta

### `GET /api/proyecto-etapa`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idProyectoEtapa": 1,
      "idProyecto": 1,
      "idEtapa": 2,
      "fechaInicio": "2026-10-10",
      "fechaFin": "2026-10-25",
      "estado": "en_progreso"
    },
    {
      "idProyectoEtapa": 2,
      "idProyecto": 1,
      "idEtapa": 3,
      "fechaInicio": "2026-10-26",
      "fechaFin": null,
      "estado": "pendiente"
    }
  ]
}
```

---

### `GET /api/proyecto-etapa/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idProyectoEtapa": 1,
    "idProyecto": 1,
    "idEtapa": 2,
    "fechaInicio": "2026-10-10",
    "fechaFin": "2026-10-25",
    "estado": "en_progreso"
  }
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "La etapa del proyecto no existe"
}
```

---

### `POST /api/proyecto-etapa`

**Cuerpo de la Petición:**

```json
{
  "idProyecto": 1,
  "idEtapa": 3,
  "fechaInicio": "2026-10-26",
  "fechaFin": "2026-11-15"
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "message": "Etapa asignada al proyecto correctamente",
  "data": {
    "idProyectoEtapa": 2,
    "idProyecto": 1,
    "idEtapa": 3,
    "fechaInicio": "2026-10-26",
    "fechaFin": "2026-11-15",
    "estado": "pendiente"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "La fechaFin no puede ser anterior a la fechaInicio"
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "Esta etapa ya se encuentra asignada a este proyecto"
}
```

---

### `PUT /api/proyecto-etapa/:id`

**Cuerpo de la Petición:**

```json
{
  "estado": "en_progreso",
  "fechaFin": "2026-11-20"
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Etapa del proyecto actualizada correctamente",
  "data": {
    "idProyectoEtapa": 2,
    "idProyecto": 1,
    "idEtapa": 3,
    "fechaInicio": "2026-10-26",
    "fechaFin": "2026-11-20",
    "estado": "en_progreso"
  }
}
```

**Respuesta de Error (`400 Bad Request` - Transición inválida):**

```json
{
  "success": false,
  "message": "No se permite cambiar el estado de 'completada' a 'pendiente'"
}
```

---

### `DELETE /api/proyecto-etapa/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Etapa eliminada del proyecto correctamente",
  "data": {
    "idProyectoEtapa": 2
  }
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "La etapa del proyecto no existe"
}
```
