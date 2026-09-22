````markdown
# Módulo de Propuestas (`PROPUESTAS.md`)

## Visión General

Este módulo gestiona la creación y administración de las propuestas comerciales (cotizaciones) enviadas a los clientes. Funciona como el puente entre los clientes (`Clientes`) y la contratación de servicios (`PropuestaDetalle`), sirviendo como paso previo fundamental para la apertura de un proyecto en el sistema.

---

## Esquema de Base de Datos

- **`Propuestas`**:
  - `id_propuesta` (Integer, PK): Identificador único de la propuesta.
  - `id_cliente` (Integer, FK): Referencia obligatoria a la tabla `Clientes`.
  - `nombre` (Varying Character): Título o nombre de la propuesta (máx. 150 caracteres).
  - `descripcion` (Text, Optional): Detalle del alcance o notas generales de la cotización.
  - `fecha_creacion` (Timestamp): Fecha y hora de creación automática (`now()`).
  - `fecha_vencimiento` (Date, Optional): Fecha límite de validez de la oferta.
  - `subtotal` (Numeric 12,2): Suma de precios antes de impuestos (inicia en `0`).
  - `impuestos` (Numeric 12,2): Monto de impuestos aplicados (inicia en `0`).
  - `total` (Numeric 12,2): Suma final a cobrar (inicia en `0`).
  - `estado` (Varying Character): Estado del flujo comercial (`pendiente`, `enviada`, `aceptada`, `rechazada`, `vencida`, `cancelada`). Por defecto: `pendiente`.

---

## Reglas de Negocio

- **Relación Obligatoria:** Para crear una propuesta, el `idCliente` debe existir previamente en la tabla `Clientes`.
- **Estados Permitidos:** El campo `estado` solo acepta uno de los siguientes valores:
  - `'pendiente'` _(por defecto)_
  - `'enviada'`
  - `'aceptada'`
  - `'rechazada'`
  - `'vencida'`
  - `'cancelada'`
- **Valores Financieros:** Los campos `subtotal`, `impuestos` y `total` deben ser números mayores o iguales a 0 (`>= 0`). Se inicializan en `0` y se calcularán automáticamente cuando se agreguen ítems en `PropuestaDetalle`.
- **Fechas:** La `fechaCreacion` se genera automáticamente. Si se proporciona `fechaVencimiento`, debe ser igual o posterior a la fecha actual.
- **Integridad Referencial al Eliminar (`DELETE /api/propuestas/:id`):** No se permite eliminar una propuesta si esta ya contiene ítems en `PropuestaDetalle` o si ya ha sido convertida en un registro dentro de `Proyectos` (`onDelete: Restrict`).

---

## Endpoints de la API

| Método   | Endpoint              | Descripción                                                          |
| :------- | :-------------------- | :------------------------------------------------------------------- |
| `GET`    | `/api/propuestas`     | Obtiene el listado de propuestas (incluyendo datos del cliente).     |
| `GET`    | `/api/propuestas/:id` | Obtiene el detalle de una propuesta por su `idPropuesta`.            |
| `POST`   | `/api/propuestas`     | Registra una nueva propuesta comercial.                              |
| `PUT`    | `/api/propuestas/:id` | Actualiza datos de la propuesta (nombre, cliente, fechas, estado).   |
| `DELETE` | `/api/propuestas/:id` | Elimina una propuesta (si no tiene detalles o proyectos vinculados). |

---

## Ejemplos de Petición / Respuesta

### `POST /api/propuestas`

**Cuerpo de la Petición:**

```json
{
  "idCliente": 1,
  "nombre": "Propuesta de Rediseño Web y SEO",
  "descripcion": "Cotización integral para el cliente ACME Corp",
  "fechaVencimiento": "2026-10-31"
}
```
````

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "mensaje": "Propuesta creada correctamente",
  "data": {
    "idPropuesta": 10,
    "idCliente": 1,
    "nombre": "Propuesta de Rediseño Web y SEO",
    "descripcion": "Cotización integral para el cliente ACME Corp",
    "fechaCreacion": "2026-09-21T15:30:00.000Z",
    "fechaVencimiento": "2026-10-31",
    "subtotal": 0.0,
    "impuestos": 0.0,
    "total": 0.0,
    "estado": "pendiente"
  }
}
```

---

### `PUT /api/propuestas/:id`

**Cuerpo de la Petición:**

```json
{
  "nombre": "Propuesta de Rediseño Web, SEO y App Móvil",
  "estado": "enviada"
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Propuesta actualizada correctamente",
  "data": {
    "idPropuesta": 10,
    "idCliente": 1,
    "nombre": "Propuesta de Rediseño Web, SEO y App Móvil",
    "descripcion": "Cotización integral para el cliente ACME Corp",
    "fechaCreacion": "2026-09-21T15:30:00.000Z",
    "fechaVencimiento": "2026-10-31",
    "subtotal": 0.0,
    "impuestos": 0.0,
    "total": 0.0,
    "estado": "enviada"
  }
}
```

---

### `DELETE /api/propuestas/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Propuesta eliminada correctamente"
}
```

**Respuesta de Error (`400 Bad Request` - En uso):**

```json
{
  "success": false,
  "mensaje": "No se puede eliminar la propuesta porque tiene detalles de servicios o proyectos asociados"
}
```

```

```
