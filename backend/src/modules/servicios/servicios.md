# Módulo de Servicios (`SERVICIOS.md`)

## Visión General

El módulo de servicios gestiona el catálogo principal de ofertas técnicas y comerciales del sistema (`Servicios`).

Esta tabla actúa como catálogo de referencia para la elaboración de cotizaciones (`PropuestaDetalle`) y la ejecución operacional (`ProyectoServicio`). La eliminación de un servicio opera mediante un **borrado físico condicional**: no se permite eliminar un servicio si ya ha sido incluido en propuestas o proyectos, protegiendo la integridad referencial y el historial financiero.

---

## Esquema de Base de Datos

- **`Servicios`**:
- `id_servicio` (Integer, PK): Identificador único del servicio (autoincrementable).
- `nombre_servicio` (Varying Character 100, Unique): Nombre del servicio ofrecido.
- `descripcion` (Text, Opcional): Descripción detallada del alcance del servicio.
- `precio_base` (Numeric 12,2): Precio base del servicio (`precio_base >= 0`).

---

## Reglas de Negocio

- **Validación de Identificador (`:id`):** En todos los endpoints con parámetros de ruta, el `idServicio` debe ser un entero positivo mayor a cero.
- **Sanitización de Datos (`POST` y `PUT`):**
- Se aplica `.trim()` a `nombreServicio`. No se admiten cadenas vacías ni nombres de más de 100 caracteres.
- Si se proporciona `descripcion`, también se sanitiza con `.trim()`.

- **Validación de Precio (`precioBase`):** El valor de `precioBase` debe ser obligatoriamente un número positivo o cero (`>= 0`). No se permiten valores negativos.
- **Unicidad:** No se permite duplicar el `nombreServicio` en el catálogo (evita registros redundantes).
- **Control de Borrado (`DELETE /api/servicios/:id`):** Antes de eliminar un servicio, se verifica si está vinculado a registros en `PropuestaDetalle` o `ProyectoServicio`. Si está en uso, la solicitud se rechaza con un código HTTP `400 Bad Request`.
- **Manejo de Códigos HTTP:**
- **`200 OK`**: Solicitud procesada correctamente.
- **`201 Created`**: Servicio creado exitosamente.
- **`400 Bad Request`**: Datos de entrada inválidos, precio negativo o el servicio tiene dependencias asociadas.
- **`404 Not Found`**: El servicio solicitado no existe.
- **`409 Conflict`**: El nombre del servicio ya se encuentra registrado.
- **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

## Endpoints de la API

| Método   | Endpoint             | Descripción                                                                       |
| -------- | -------------------- | --------------------------------------------------------------------------------- |
| `GET`    | `/api/servicios`     | Obtiene el listado completo de servicios registrados en el catálogo.              |
| `GET`    | `/api/servicios/:id` | Obtiene la información detallada de un servicio por su ID.                        |
| `POST`   | `/api/servicios`     | Registra un nuevo servicio en el catálogo.                                        |
| `PUT`    | `/api/servicios/:id` | Actualiza la información (`nombreServicio`, `descripcion`, `precioBase`). Proceso |
| `DELETE` | `/api/servicios/:id` | Elimina un servicio si no está referenciado en propuestas o proyectos. Proceso    |

---

## Ejemplos de Petición / Respuesta

### `GET /api/servicios`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idServicio": 1,
      "nombreServicio": "Desarrollo Web",
      "descripcion": "Desarrollo de sitio web corporativo a medida.",
      "precioBase": "1500.00"
    },
    {
      "idServicio": 2,
      "nombreServicio": "Diseño UI/UX",
      "descripcion": "Diseño de interfaces e interacción de usuario.",
      "precioBase": "800.00"
    }
  ]
}
```

---

### `GET /api/servicios/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idServicio": 1,
    "nombreServicio": "Desarrollo Web",
    "descripcion": "Desarrollo de sitio web corporativo a medida.",
    "precioBase": "1500.00"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "El idServicio debe ser un entero positivo"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "Servicio no encontrado"
}
```

---

### `POST /api/servicios`

**Cuerpo de la Petición:**

```json
{
  "nombreServicio": "  Marketing Digital  ",
  "descripcion": "Gestión de campañas publicitarias y posicionamiento.",
  "precioBase": 600.0
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "message": "Servicio creado correctamente",
  "data": {
    "idServicio": 3,
    "nombreServicio": "Marketing Digital",
    "descripcion": "Gestión de campañas publicitarias y posicionamiento.",
    "precioBase": "600.00"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "El precioBase debe ser mayor o igual a 0"
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "Ya existe un servicio con ese nombre"
}
```

---

### `PUT /api/servicios/:id`

**Cuerpo de la Petición:**

```json
{
  "nombreServicio": "Marketing Digital & Seo",
  "descripcion": "Gestión de campañas y posicionamiento orgánico SEO.",
  "precioBase": 750.0
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Servicio actualizado correctamente",
  "data": {
    "idServicio": 3,
    "nombreServicio": "Marketing Digital & Seo",
    "descripcion": "Gestión de campañas y posicionamiento orgánico SEO.",
    "precioBase": "750.00"
  }
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "Ya existe otro servicio con ese nombre"
}
```

---

### `DELETE /api/servicios/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Servicio eliminado correctamente",
  "data": {
    "idServicio": 3,
    "nombreServicio": "Marketing Digital & Seo",
    "descripcion": "Gestión de campañas y posicionamiento orgánico SEO.",
    "precioBase": "750.00"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "No se puede eliminar el servicio porque se encuentra asociado a propuestas o proyectos activos"
}
```
