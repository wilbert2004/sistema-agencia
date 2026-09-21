# 🚀 Sistema de Gestión para Agencia Creativa / Estudio (API REST)

Bienvenido al repositorio del backend para la gestión integral de clientes, trabajadores, especialidades, servicios y proyectos de la agencia.

Este sistema está diseñado bajo una arquitectura modular por capas, enfocado en la mantenibilidad, escalabilidad, sanitización estricta de datos e integridad referencial en base de datos.

---

## 🛠️ Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework Web:** Express.js (JavaScript / CommonJS)
- **Base de Datos:** PostgreSQL
- **ORM / Capa DB:** Prisma 8 (`db.orm.public`)
- **Pruebas de API:** Thunder Client / Postman

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue el patrón de diseño **por capas modularizado** para garantizar la separación de responsabilidades:

```text
Cliente / Client HTTP
        │
        ▼
   Routes (Express Router)
        │
        ▼
   Validation (Middleware por operación)
        │
        ▼
   Controller (Manejo de HTTP req/res)
        │
        ▼
   Service (Lógica de Negocio y Reglas)
        │
        ▼
   Prisma 8 ORM (db.orm.public)
        │
        ▼
   Base de Datos (PostgreSQL)

```

---

## 📂 Estructura de Directorios

```text
src/
├── config/
│   └── database.js                 # Configuración del cliente Prisma / DB
├── modules/
│   ├── usuarios/                   # Autenticación, roles y usuarios
│   ├── clientes/                   # Información comercial de clientes
│   ├── trabajadores/               # Gestión de personal/trabajadores
│   ├── especialidades/             # Catálogo general de competencias técnicas
│   ├── trabajador-especialidad/    # Tabla pivote (Asignaciones)
│   └── servicios/                  # Catálogo de servicios comerciales
└── app.js                          # Punto de entrada de la aplicación Express

```

---

## 📑 Módulos e Integridad del Sistema

### 👤 1. Usuarios y Roles (`/api/usuarios`)

- **Propósito:** Control de acceso, perfiles e identidades del sistema.
- **Baja Lógica:** La eliminación se gestiona cambiando el estado `activo = false` para preservar el historial operativo y referencial.

### 💼 2. Trabajadores (`/api/trabajadores`)

- **Propósito:** Perfiles del personal técnico.
- **Reglas de Negocio:**
- Un usuario asignado a un trabajador debe tener el rol correspondiente y estar activo (`activo = true`).
- La desactivación de un trabajador cambia la propiedad `activo` del usuario asociado a `false`.

### 🏷️ 3. Especialidades (`/api/especialidades`)

- **Propósito:** Catálogo unificado de habilidades y áreas técnicas.
- **Reglas de Negocio:**
- Sanitización estricta de nombres con `.trim()`.
- Nombres únicos (previene duplicados tipo `"Backend"` y `" Backend "`).
- **Borrado Condicional:** No permite eliminar una especialidad si está asociada a uno o más trabajadores.

### 🔗 4. Trabajador-Especialidad (`/api/trabajador-especialidad`)

- **Propósito:** Tabla intermedia (pivote) con Clave Primaria Compuesta `(idTrabajador, idEspecialidad)`.
- **Reglas de Negocio:**
- No aplica operaciones `PUT` por diseño REST (se desasocia con `DELETE` y se asocia con `POST`).
- Valida que el trabajador exista y su usuario esté activo antes de asignar.
- Previene registros duplicados (`409 Conflict`).

### 📦 5. Servicios (`/api/servicios`)

- **Propósito:** Catálogo comercial de servicios ofrecidos por la agencia.
- **Reglas de Negocio:**
- Nombres únicos sanitizados con `.trim()`.
- Validación de `precioBase` obligatorio y mayor o igual a cero (`precioBase >= 0`).
- **Protección Referencial:** Bloquea la eliminación si el servicio está en uso en propuestas o proyectos.

---

## 🌐 Resumen de Endpoints Principales

### Especialidades (`/api/especialidades`)

| Método   | Endpoint                  | Descripción                                   |
| -------- | ------------------------- | --------------------------------------------- |
| `GET`    | `/api/especialidades`     | Listar catálogo de especialidades             |
| `GET`    | `/api/especialidades/:id` | Obtener especialidad por ID                   |
| `POST`   | `/api/especialidades`     | Crear nueva especialidad                      |
| `PUT`    | `/api/especialidades/:id` | Actualizar nombre                             |
| `DELETE` | `/api/especialidades/:id` | Eliminar (si no tiene trabajadores asignados) |

### Trabajador-Especialidad (`/api/trabajador-especialidad`)

| Método   | Endpoint                                                     | Descripción                                  |
| -------- | ------------------------------------------------------------ | -------------------------------------------- |
| `GET`    | `/api/trabajador-especialidad`                               | Listar todas las asignaciones                |
| `GET`    | `/api/trabajador-especialidad/:idTrabajador/:idEspecialidad` | Obtener relación específica por PK compuesta |
| `POST`   | `/api/trabajador-especialidad`                               | Asignar especialidad a trabajador activo     |
| `DELETE` | `/api/trabajador-especialidad/:idTrabajador/:idEspecialidad` | Desasociar especialidad de trabajador        |

### Servicios (`/api/servicios`)

| Método   | Endpoint             | Descripción                           |
| -------- | -------------------- | ------------------------------------- |
| `GET`    | `/api/servicios`     | Listar servicios del catálogo         |
| `GET`    | `/api/servicios/:id` | Obtener servicio por ID               |
| `POST`   | `/api/servicios`     | Crear nuevo servicio                  |
| `PUT`    | `/api/servicios/:id` | Actualizar servicio                   |
| `DELETE` | `/api/servicios/:id` | Eliminar servicio (si no está en uso) |

---

## 🚦 Convención de Códigos HTTP

- **`200 OK`**: Petición procesada correctamente.
- **`201 Created`**: Recurso creado exitosamente.
- **`400 Bad Request`**: Error de validación de sintaxis, formato o restricciones de integridad en datos enviados.
- **`404 Not Found`**: El recurso o registro solicitado no existe en la base de datos.
- **`409 Conflict`**: Conflicto de duplicidad (claves únicas o asignaciones repetidas).
- **`500 Internal Server Error`**: Error no controlado en el servidor.

---

## 🔧 Configuración e Instalación

1. **Clonar el repositorio:**

```bash
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio

```

2. **Instalar dependencias:**

```bash
npm install

```

3. **Variables de Entorno (`.env`):**
   Crea un archivo `.env` en la raíz del proyecto con la cadena de conexión a PostgreSQL:

```env
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/NOMBRE_BD?schema=public"
PORT=3000

```

4. **Ejecutar migraciones/Sincronizar esquema:**

```bash
npx prisma generate

```

5. **Iniciar el servidor en desarrollo:**

```bash
npm run dev
# o node src/app.js

```

---

## 📝 Próximos Pasos en la Hoja de Ruta

- [ ] Finalizar CRUD de Servicios (`PUT` y `DELETE`).
- [ ] Módulo de **Etapas**.
- [ ] Módulo de **Propuestas** y **PropuestaDetalle**.
- [ ] Módulo de **Proyectos**, **ProyectoServicio** y **ProyectoEtapa**.
- [ ] Módulo de **Asignaciones** y **Actividades**.

```
Si te gusto el sistema la raea del backend no olvides dejarme una estrellita
```
