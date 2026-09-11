# Módulo de Clientes (`CLIENTES.md`)

## Visión General

Este módulo gestiona la capa comercial de los usuarios del sistema. Mantiene una relación $1:1$ dependiente con la tabla `Usuarios`: la tabla `Clientes` almacena exclusivamente los datos de la entidad (`empresa`, `telefono`, `direccion`), mientras que `Usuarios` gestiona la autenticación, estado (`activo`) y permisos (`idRol`).

---

## Esquema de Base de Datos

Esquema de Base de Datos (Prisma Model: Clientes)
**idCliente (Int, PK, Autoincrement)**: Identificador del cliente (`id_cliente`).
**idUsuario (Int, FK, Unique)**: Relación $1:1$ con el modelo Usuarios (`onDelete: Restrict`).
**empresa (VarChar(150), Opcional)**: Nombre comercial de la empresa.
**telefono** (`VarChar(20)`): Teléfono de contacto.
**direccion**(`String`): Dirección física.

---

## Reglas de Negocio

- **Creación:** Un cliente solo puede registrarse si su `idUsuario` existe previamente en `Usuarios`, está en estado `activo: true` y posee el `idRol: 3`.
- **Persistencia de Cuenta:** La entrega o cierre de un proyecto **no desactiva la cuenta del usuario**. El usuario permanece activo para consultar su historial de proyectos y descargas.
- **Baja Lógica (`DELETE /api/clientes/:id`):** La eliminación de un cliente no realiza un borrado físico en la base de datos (`.delete()`). En su lugar, aplica una desactivación lógica en la tabla `Usuarios` cambiando `activo: false` para suspender su acceso al sistema sin perder el historial.
  **Relación Unívoca**: Un idUsuario solo puede estar vinculado a un registro en la tabla Clientes (@unique).

---

## Endpoints de la API

| Método   | Endpoint            | Descripción                                                                        |
| -------- | ------------------- | ---------------------------------------------------------------------------------- |
| `GET`    | `/api/clientes`     | Obtiene el listado completo de clientes.                                           |
| `GET`    | `/api/clientes/:id` | Obtiene el detalle de un cliente por su `idCliente`.                               |
| `POST`   | `/api/clientes`     | Registra los datos comerciales de un usuario con rol Cliente.                      |
| `PUT`    | `/api/clientes/:id` | Actualiza parcialmente los datos comerciales (`empresa`, `telefono`, `direccion`). |
| `DELETE` | `/api/clientes/:id` | Ejecuta la baja lógica desactivando la cuenta en `Usuarios` (`activo = false`).    |

---

## Ejemplos de Petición / Respuesta

### `POST /api/clientes`

**Cuerpo de la Petición:**

```json
{
  "idUsuario": 3,
  "empresa": "Tecno Plaza",
  "telefono": "9997643118",
  "direccion": "Santa Lucía"
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "data": {
    "idCliente": 1,
    "idUsuario": 3,
    "empresa": "Tecno Plaza",
    "telefono": "9997643118",
    "direccion": "Santa Lucía"
  }
}
```

---

### `PUT /api/clientes/:id`

**Cuerpo de la Petición:**

```json
{
  "empresa": "Tecno Plaza S.A. de C.V."
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Cliente actualizado correctamente",
  "data": {
    "idCliente": 1,
    "idUsuario": 3,
    "empresa": "Tecno Plaza S.A. de C.V.",
    "telefono": "9997643118",
    "direccion": "Santa Lucía"
  }
}
```

---

### `DELETE /api/clientes/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Cliente desactivado correctamente"
}
```
