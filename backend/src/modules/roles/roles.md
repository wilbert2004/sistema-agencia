# Módulo de Roles (`ROLES.md`)

## Visión General

Este módulo gestiona la definición de los roles dentro del sistema (por ejemplo: `1 = Administrador`, `2 = Trabajador`, `3 = Cliente`). Funciona como un catálogo base utilizado por la tabla `Usuarios` para controlar los permisos de acceso.

---

## Esquema de Base de Datos

- **`Roles`**:
- `id_rol` (Integer, PK): Identificador único del rol.
- `nombre` (Varying Character): Nombre descriptivo del rol.
- `descripcion` (Text): Explicación opcional de las funciones asociadas al rol.

---

## Reglas de Negocio

- **Integridad Referencial al Eliminar (`DELETE /api/roles/:id`):** No se puede eliminar un rol si existen registros en la tabla `Usuarios` asignados a dicho `idRol`. Debe reasignarse o eliminarse primero a esos usuarios antes de borrar el rol.
- **Campos Obligatorios:** Para la creación de un nuevo rol, el campo `nombre` es estrictamente requerido.

**Restricción al Eliminar** (DELETE /api/roles/:id): Debido a la regla @relation(..., onDelete: Restrict) en Prisma, la base de datos impedirá eliminar un rol si existen registros vinculados en la tabla Usuarios.

---

## Endpoints de la API

| Método   | Endpoint         | Descripción                                                           |
| -------- | ---------------- | --------------------------------------------------------------------- |
| `GET`    | `/api/roles`     | Obtiene el listado completo de roles.                                 |
| `GET`    | `/api/roles/:id` | Obtiene el detalle de un rol por su `idRol`.                          |
| `POST`   | `/api/roles`     | Crea un nuevo rol en el catálogo.                                     |
| `PUT`    | `/api/roles/:id` | Actualiza parcialmente el `nombre` o `descripcion` de un rol.         |
| `DELETE` | `/api/roles/:id` | Elimina físicamente un rol (siempre que no tenga usuarios asignados). |

---

## Ejemplos de Petición / Respuesta

### `POST /api/roles`

**Cuerpo de la Petición:**

```json
{
  "nombre": "Trabajador",
  "descripcion": "Usuario con permisos para gestionar tareas asignadas"
}
```

**Respuesta Exitosa (`201 Created`):**

```json
{
  "success": true,
  "mensaje": "Rol creado correctamente",
  "data": {
    "idRol": 2,
    "nombre": "Trabajador",
    "descripcion": "Usuario con permisos para gestionar tareas asignadas"
  }
}
```

---

### `PUT /api/roles/:id`

**Cuerpo de la Petición:**

```json
{
  "descripcion": "Gestor de proyectos y tareas"
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Rol actualizado correctamente",
  "data": {
    "idRol": 2,
    "nombre": "Trabajador",
    "descripcion": "Gestor de proyectos y tareas"
  }
}
```

---

### `DELETE /api/roles/:id`

**Respuesta Exitosa (`200 OK`):**

```json
{
  "success": true,
  "mensaje": "Rol eliminado correctamente"
}
```

**Respuesta de Error (`400 Bad Request` - Rol en uso):**

```json
{
  "success": false,
  "mensaje": "No se puede eliminar el rol porque está asignado a uno o más usuarios"
}
```
