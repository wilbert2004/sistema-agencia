# Módulo de Usuarios (`USUARIOS.md`)

## Visión General

El módulo de usuarios gestiona la autenticación, roles y estado de acceso de todos los integrantes del sistema (Administradores, Trabajadores y Clientes).

La funcionalidad de eliminación ópera mediante un **borrado lógico** (`activo: false`). No se realizan borrados físicos directamente en la base de datos para evitar la pérdida irrecuperable de información y mantener la integridad referencial con los demás módulos (como Clientes o Tareas).

---

## Esquema de Base de Datos

- **`Usuarios`**:
- `id_usuario` (Integer, PK): Identificador único del usuario.
- `id_rol` (Integer, FK): Rol asignado (`1 = Admin`, `2 = Trabajador`, `3 = Cliente`).
- `nombre` (Varying Character): Nombre completo del usuario.
- `correo` (Varying Character): Correo electrónico (único).
- `contrasena_hash` (Varying Character): Contraseña encriptada.
- `activo` (Boolean): Estado de la cuenta (`true` por defecto).
- `fecha_registro` (Timestamp): Fecha de creación del registro.

---

## Reglas de Negocio

- **Borrado Lógico (`DELETE /api/usuarios/:id`):** Al eliminar un usuario, no se destruye el registro en la base de datos (`.del()`), sino que se actualiza el campo `activo` a `false`.
- **Creación de Usuarios (`POST`):** Se crea el usuario con `activo: true` por defecto. Si el `idRol` enviado corresponde a un Cliente (`idRol = 3`), posteriormente se debe registrar su información comercial en la API `/api/clientes`.
- **Manejo de Códigos HTTP:**
- **`200 OK`**: Solicitud procesada correctamente.
- **`201 Created`**: Usuario creado exitosamente.
- **`400 Bad Request`**: Datos de entrada incorrectos o faltantes.
- **`404 Not Found`**: El usuario solicitado no existe.
- **`500 Internal Server Error`**: Error interno del servidor o de la base de datos.

---

## Endpoints de la API

| Método   | Endpoint            | Descripción                                                                     |
| -------- | ------------------- | ------------------------------------------------------------------------------- |
| `GET`    | `/api/usuarios`     | Obtiene el listado de usuarios (filtrando preferentemente por `activo = true`). |
| `GET`    | `/api/usuarios/:id` | Obtiene la información detallada de un usuario por su ID.                       |
| `POST`   | `/api/usuarios`     | Registra un nuevo usuario en la base de datos (`activo = true`).                |
| `PUT`    | `/api/usuarios/:id` | Actualiza los datos de un usuario (`nombre`, `correo`, `idRol`, etc.).          |
| `DELETE` | `/api/usuarios/:id` | Ejecuta la baja lógica cambiando el atributo `activo` a `false`.                |

---

## Ejemplos de Petición / Respuesta

### `GET /api/usuarios`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "idUsuario": 1,
      "idRol": 1,
      "nombre": "Administrador General",
      "correo": "admin@creativaestudio.com",
      "activo": true,
      "fechaRegistro": "2026-09-03T16:30:26.911Z"
    },
    {
      "idUsuario": 2,
      "idRol": 3,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@tecnoplaza.com",
      "activo": true,
      "fechaRegistro": "2026-09-07T15:20:01.642Z"
    }
  ]
}
```

---

### `POST /api/usuarios`

**Cuerpo de la Petición:**

```json
{
  "idRol": 3,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@tecnoplaza.com",
  "contrasena": "password123"
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "mensaje": "Usuario creado correctamente",
  "data": {
    "idUsuario": 2,
    "idRol": 3,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@tecnoplaza.com",
    "activo": true,
    "fechaRegistro": "2026-09-07T15:20:01.642Z"
  }
}
```

---

### `PUT /api/usuarios/:id`

**Cuerpo de la Petición:**

```json
{
  "nombre": "Juan Pérez Modificado",
  "idRol": 2
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Usuario actualizado correctamente",
  "data": {
    "idUsuario": 2,
    "idRol": 2,
    "nombre": "Juan Pérez Modificado",
    "correo": "juan.perez@tecnoplaza.com",
    "activo": true
  }
}
```

---

### `DELETE /api/usuarios/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Usuario desactivado correctamente"
}
```

**Respuesta de Error (`404 Not Found`):**

```json
{
  "success": false,
  "mensaje": "Usuario no encontrado"
}
```
