# Módulo de Etapas (`ETAPAS.md`)

## Visión General

Este módulo gestiona la definición de las etapas de un proyecto dentro del sistema (por ejemplo: `1 = Planificación`, `2 = Desarrollo`, `3 = Pruebas`). Funciona como un catálogo base utilizado por la tabla `ProyectoEtapa` para controlar la progresión y fases de ejecución de los proyectos.

---

## Esquema de Base de Datos

- **`Etapas`**:
- `id_etapa` (Integer, PK): Identificador único de la etapa.
- `nombre_etapa` (Varying Character, Unique): Nombre único y descriptivo de la etapa (máx. 100 caracteres).
- `descripcion` (Text, Optional): Explicación o detalle opcional del alcance de la etapa.

---

## Reglas de Negocio

- **Campos Obligatorios:** Para la creación de una nueva etapa, el campo `nombreEtapa` es estrictamente requerido.
- **Unicidad:** El campo `nombreEtapa` es único en el sistema (`@unique`), por lo que no pueden existir dos etapas con el mismo nombre.
- **Integridad Referencial al Eliminar (`DELETE /api/etapas/:id`):** No se puede eliminar una etapa si existen registros en la tabla `ProyectoEtapa` vinculados a dicho `idEtapa`.
- **Restricción al Eliminar:** Debido a la regla `@relation(..., onDelete: Restrict)` en Prisma, la base de datos impedirá eliminar una etapa si está asignada a uno o más proyectos.

---

## Endpoints de la API

| Método   | Endpoint          | Descripción                                                               |
| -------- | ----------------- | ------------------------------------------------------------------------- |
| `GET`    | `/api/etapas`     | Obtiene el listado completo de etapas.                                    |
| `GET`    | `/api/etapas/:id` | Obtiene el detalle de una etapa por su `idEtapa`.                         |
| `POST`   | `/api/etapas`     | Crea una nueva etapa en el catálogo.                                      |
| `PUT`    | `/api/etapas/:id` | Actualiza el `nombreEtapa` o `descripcion` de una etapa.                  |
| `DELETE` | `/api/etapas/:id` | Elimina físicamente una etapa (siempre que no esté asociada a proyectos). |

---

## Ejemplos de Petición / Respuesta

### `POST /api/etapas`

**Cuerpo de la Petición:**

```json
{
  "nombreEtapa": "Diseño UI/UX",
  "descripcion": "Creación de prototipos, wireframes y flujo de interfaz"
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "mensaje": "Etapa creada correctamente",
  "data": {
    "idEtapa": 1,
    "nombreEtapa": "Diseño UI/UX",
    "descripcion": "Creación de prototipos, wireframes y flujo de interfaz"
  }
}
```

---

### `PUT /api/etapas/:id`

**Cuerpo de la Petición:**

```json
{
  "nombreEtapa": "Diseño UI/UX y Prototipado",
  "descripcion": "Fase de diseño visual, prototipos interactivos y pruebas de usabilidad"
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Etapa actualizada correctamente",
  "data": {
    "idEtapa": 1,
    "nombreEtapa": "Diseño UI/UX y Prototipado",
    "descripcion": "Fase de diseño visual, prototipos interactivos y pruebas de usabilidad"
  }
}
```

---

### `DELETE /api/etapas/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Etapa eliminada correctamente"
}
```

**Respuesta de Error (`400 Bad Request` - Etapa en uso):**

```json
{
  "success": false,
  "mensaje": "No se puede eliminar la etapa porque está siendo utilizada en uno o más proyectos"
}
```
