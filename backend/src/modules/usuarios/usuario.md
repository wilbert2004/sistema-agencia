El módulo de usuario tiene **5 endpoints de API REST**: listar (mostrar todos), obtener por ID (buscar), crear, editar y cambiar estado (borrado lógico).

«El módulo de usuario cuenta con 5 APIs REST: **listar todos, buscar por ID, crear, editar y eliminar**. La funcionalidad de "eliminar" operará mediante un **borrado lógico** (utilizando un atributo _activo / inactivo_), ya que eliminar los registros directamente de la base de datos es innecesario y provocaría la pérdida irrecuperable de información.»

### Mapeo técnico de las 5 APIs REST

| **Listar** | `GET` | `/api/usuarios` | Muestra el listado de usuarios (generalmente filtrados por `activo = true`). |
| **Buscar** | `GET` | `/api/usuarios/{id}` | Obtiene la información detallada de un usuario por su ID. |
| **Crear** | `POST` | `/api/usuarios` | Registra un nuevo usuario en la base de datos (con `activo = true` por defecto). |
| **Editar** | `PUT` / `PATCH` | `/api/usuarios/{id}` | Actualiza los datos del usuario. |
| **"Eliminar"** | `PATCH` / `DELETE` | `/api/usuarios/{id}/estado` | **Borrado Lógico:** Cambia el atributo `activo` a `false`. |

los apirest creados para el rol de usuarios:
Método Endpoint Función
GET /api/usuarios Obtener todos
GET /api/usuarios/:id Obtener uno
POST /api/usuarios Crear
PUT /api/usuarios/:id Actualizar
DELETE /api/usuarios/:id Eliminar

Manejo correcto de errores:
200 → correcto
201 → creado
400 → datos incorrectos
404 → no encontrado
500 → error interno
