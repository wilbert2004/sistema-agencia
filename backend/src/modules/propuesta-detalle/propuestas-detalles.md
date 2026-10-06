````markdown
# Módulo de Detalles de Propuesta (`PROPUESTA_DETALLE.md`)

## Visión General

Este módulo gestiona los ítems o partidas individuales de servicios asignados a una propuesta comercial. Representa el desglose específico de los servicios cotizados, incluyendo su cantidad, precio unitario acordado y subtotal por línea. Además, desencadena el recálculo automático de los acumulados financieros (`subtotal`, `impuestos`, `total`) en la tabla principal `Propuestas`.

---

## Esquema de Base de Datos

- **`PropuestaDetalle`**:
  - `id_propuesta_detalle` (Integer, PK): Identificador único del detalle de la propuesta.
  - `id_propuesta` (Integer, FK): Referencia obligatoria a la propuesta contenedora (`onDelete: Cascade`).
  - `id_servicio` (Integer, FK): Referencia obligatoria al servicio cotizado (`onDelete: Restrict`).
  - `cantidad` (Integer): Cantidad del servicio solicitado (`CHECK: cantidad > 0`). Valor por defecto: `1`.
  - `precio_unitario` (Numeric 12,2): Precio unitario acordado para la propuesta (`CHECK: precio_unitario >= 0`).
  - `subtotal` (Numeric 12,2): Importe calculado automáticamente (`cantidad * precio_unitario`) (`CHECK: subtotal >= 0`).

---

## Reglas de Negocio

1. **Inviolabilidad de Cálculos:** El campo `subtotal` **no es proporcionado por el usuario** ni por el frontend; es calculado estrictamente por el backend como `cantidad * precioUnitario`.
2. **Histórico de Precios (`precioUnitario`):** No se consulta dinámicamente el `precioBase` de la tabla `Servicios` en cada lectura. Se congela el valor del `precioUnitario` acordado en el momento de crear/editar el detalle para mantener la integridad histórica de la propuesta.
3. **Estado Editable de la Propuesta:** Solo se permite crear, actualizar o eliminar detalles en propuestas cuyo estado sea **`pendiente`** o **`enviada`**. Si la propuesta está en estado `aceptada`, `rechazada`, `vencida` o `cancelada`, las operaciones de modificación quedan **bloqueadas**.
4. **Actualización Automática en Cascada:** Al realizar cualquier operación de modificación (`POST`, `PUT`, `DELETE`) en esta tabla, el servicio recalcula automáticamente el `subtotal`, `impuestos` y `total` de la propuesta vinculada en la tabla `Propuestas`.
5. **Integridad Referencial:**
   - Si se elimina una propuesta en la base de datos, sus detalles se eliminan en cascada (`onDelete: Cascade`).
   - No se puede eliminar un servicio si está siendo referenciado en algún detalle de propuesta (`onDelete: Restrict`).

---

## Endpoints de la API

| Método   | Endpoint                     | Descripción                                                 |
| :------- | :--------------------------- | :---------------------------------------------------------- |
| `GET`    | `/api/propuesta-detalle`     | Obtiene el listado completo de partidas de propuestas.      |
| `GET`    | `/api/propuesta-detalle/:id` | Obtiene el detalle de un ítem por su `idPropuestaDetalle`.  |
| `POST`   | `/api/propuesta-detalle`     | Agrega un nuevo servicio/partida a una propuesta existente. |
| `PUT`    | `/api/propuesta-detalle/:id` | Actualiza la cantidad o el precio unitario de un detalle.   |
| `DELETE` | `/api/propuesta-detalle/:id` | Elimina una partida de una propuesta.                       |

---

## Ejemplos de Petición / Respuesta

### `POST /api/propuesta-detalle`

**Cuerpo de la Petición:**

```json
{
  "idPropuesta": 10,
  "idServicio": 3,
  "cantidad": 2,
  "precioUnitario": 1500.0
}
```
````

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "mensaje": "Detalle de propuesta agregado correctamente",
  "data": {
    "idPropuestaDetalle": 1,
    "idPropuesta": 10,
    "idServicio": 3,
    "cantidad": 2,
    "precioUnitario": 1500.0,
    "subtotal": 3000.0
  }
}
```

---

### `PUT /api/propuesta-detalle/:id`

**Cuerpo de la Petición:**

```json
{
  "cantidad": 3,
  "precioUnitario": 1400.0
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Detalle de propuesta actualizado correctamente",
  "data": {
    "idPropuestaDetalle": 1,
    "idPropuesta": 10,
    "idServicio": 3,
    "cantidad": 3,
    "precioUnitario": 1400.0,
    "subtotal": 4200.0
  }
}
```

---

### `DELETE /api/propuesta-detalle/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Detalle de propuesta eliminado correctamente"
}
```

**Respuesta de Error (`400 Bad Request` - Estado bloqueado):**

```json
{
  "success": false,
  "mensaje": "No se pueden modificar los detalles de una propuesta en estado 'aceptada'"
}
```

```

```
