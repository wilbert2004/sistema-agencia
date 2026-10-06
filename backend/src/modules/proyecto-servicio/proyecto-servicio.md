# Módulo de Proyecto-Servicio (`PROYECTO_SERVICIO.md`)

## Visión General

El módulo de servicios por proyecto gestiona la relación intermedia (tabla pivote) entre los proyectos y los servicios contratados del catálogo (`ProyectoServicio`).

A diferencia de las tablas pivote simples de relación pura, esta entidad almacena atributos propios de la negociación comercial: la **cantidad** contratada y el **precio acordado** para cada servicio dentro del contexto del proyecto.

Al poseer una clave primaria compuesta (`idProyecto`, `idServicio`), la operación de actualización (`PUT`) se limita exclusivamente a modificar los valores comerciales (`cantidad` y `precioAcordado`), impidiendo la alteración de las llaves foráneas. Para reemplazar un servicio por otro, se debe desasociar la relación existente (`DELETE`) y registrar la nueva (`POST`).

---

## Esquema de Base de Datos

- **`ProyectoServicio`**:
- `id_proyecto` (Integer, PK/FK): Identificador del proyecto (referencia a `Proyectos`).
- `id_servicio` (Integer, PK/FK): Identificador del servicio (referencia a `Servicios`).
- `cantidad` (Integer, Default 1): Cantidad de unidades/horas contratadas (`cantidad > 0`).
- `precio_acordado` (Numeric 12,2): Precio unitario o paquete acordado para el proyecto (`precio_acordado >= 0`).

---

## Reglas de Negocio

- **Validación de Identificadores Compuestos (`:idProyecto` / `:idServicio`):** En los endpoints que reciben parámetros de ruta o cuerpo, ambos identificadores deben ser enteros positivos mayores a cero.
- **Estado del Proyecto (`POST`, `PUT`, `DELETE`):** Antes de modificar los servicios asociados, se valida que el proyecto exista y se encuentre en un estado editable (ej. `'planificacion'` o `'en_progreso'`). No se permite alterar servicios en proyectos `'finalizados'` o `'cancelados'`.
- **Existencia del Servicio (`POST`):** Se verifica que el servicio exista previamente en el catálogo comercial (`Servicios`).
- **Prevención de Duplicados (`POST`):** No se permite asociar dos veces el mismo servicio al mismo proyecto. Si la relación ya existe, responde con un código HTTP `409 Conflict`.
- **Validación de Valores Comerciales:**
- `cantidad`: Debe ser un número entero estrictamente mayor a 0.
- `precioAcordado`: Debe ser un número mayor o igual a 0.

- **Control de Desasociación (`DELETE`):** Se verifica la existencia previa de la relación compuesta antes de eliminarla. La eliminación solo afecta a la tabla pivote, dejando intactos el proyecto y el catálogo de servicios.
- **Manejo de Códigos HTTP:**
- **`200 OK`**: Solicitud procesada correctamente.
- **`201 Created`**: Servicio agregado al proyecto exitosamente.
- **`400 Bad Request`**: Datos de entrada inválidos, cantidades/precios negativos, o intento de modificación en proyectos no editables.
- **`404 Not Found`**: El proyecto, el servicio o la relación compuesta no existen.
- **`409 Conflict`**: El servicio ya se encuentra registrado en el proyecto.
- **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

## Endpoints de la API

| Método   | Endpoint                                         | Descripción                                                               |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| `GET`    | `/api/proyecto-servicio`                         | Obtiene el listado de todas las asociaciones proyecto-servicio.           |
| `GET`    | `/api/proyecto-servicio/proyecto/:idProyecto`    | Obtiene el detalle de todos los servicios contratados en un proyecto.     |
| `GET`    | `/api/proyecto-servicio/:idProyecto/:idServicio` | Obtiene la información específica de un servicio dentro de un proyecto.   |
| `POST`   | `/api/proyecto-servicio`                         | Asocia un nuevo servicio a un proyecto con su cantidad y precio acordado. |
| `PUT`    | `/api/proyecto-servicio/:idProyecto/:idServicio` | Actualiza la `cantidad` o `precioAcordado` de un servicio en el proyecto. |
| `DELETE` | `/api/proyecto-servicio/:idProyecto/:idServicio` | Elimina un servicio específico de un proyecto.                            |

---

## Ejemplos de Petición / Respuesta

### `GET /api/proyecto-servicio`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idProyecto": 1,
      "idServicio": 2,
      "cantidad": 1,
      "precioAcordado": "5000.00"
    },
    {
      "idProyecto": 1,
      "idServicio": 4,
      "cantidad": 2,
      "precioAcordado": "1200.00"
    }
  ]
}
```

---

### `GET /api/proyecto-servicio/proyecto/:idProyecto`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idProyecto": 1,
    "servicios": [
      {
        "idServicio": 2,
        "nombreServicio": "Desarrollo Web",
        "cantidad": 1,
        "precioAcordado": "5000.00",
        "subtotal": "5000.00"
      },
      {
        "idServicio": 4,
        "nombreServicio": "Manejo de Redes Sociales",
        "cantidad": 2,
        "precioAcordado": "1200.00",
        "subtotal": "2400.00"
      }
    ]
  }
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "Proyecto no encontrado"
}
```

---

### `GET /api/proyecto-servicio/:idProyecto/:idServicio`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "idProyecto": 1,
    "idServicio": 2,
    "cantidad": 1,
    "precioAcordado": "5000.00"
  }
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "La relación proyecto-servicio no existe"
}
```

---

### `POST /api/proyecto-servicio`

**Cuerpo de la Petición:**

```json
{
  "idProyecto": 1,
  "idServicio": 2,
  "cantidad": 2,
  "precioAcordado": 4500.0
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "message": "Servicio asignado correctamente al proyecto",
  "data": {
    "idProyecto": 1,
    "idServicio": 2,
    "cantidad": 2,
    "precioAcordado": "4500.00"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "No se pueden modificar los servicios de un proyecto finalizado o cancelado"
}
```

**Respuesta de Error (`409 Conflict`):**

```json
{
  "success": false,
  "message": "El proyecto ya tiene asignado este servicio"
}
```

---

### `PUT /api/proyecto-servicio/:idProyecto/:idServicio`

**Cuerpo de la Petición:**

```json
{
  "cantidad": 3,
  "precioAcordado": 4200.0
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Servicio del proyecto actualizado correctamente",
  "data": {
    "idProyecto": 1,
    "idServicio": 2,
    "cantidad": 3,
    "precioAcordado": "4200.00"
  }
}
```

**Respuesta de Error (`400 Bad Request`):**

```json
{
  "success": false,
  "message": "La cantidad debe ser un entero mayor a 0"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "La relación proyecto-servicio no existe"
}
```

---

### `DELETE /api/proyecto-servicio/:idProyecto/:idServicio`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "message": "Servicio eliminado del proyecto correctamente",
  "data": {
    "idProyecto": 1,
    "idServicio": 2
  }
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "message": "No existe la relación especificada entre el proyecto y el servicio"
}
```
