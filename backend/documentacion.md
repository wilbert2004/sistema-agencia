````markdown
# Documentación General del Backend (`BACKEND.md`)

## Visión General

El backend de **“sistema-agencia”** está construido sobre **Node.js**, **Express** y **Prisma ORM**, conectado a una base de datos PostgreSQL llamada `creativa_estudio`. Mantiene una arquitectura modular desacoplada mediante el patrón **Routes - Validation - Controller - Service**.

---

## 1. Configuración de Base de Datos y Prisma

- **Base de datos:** PostgreSQL (`creativa_estudio` en `localhost:5432`).
- **Ubicación del esquema:** `src/prisma/contract.prisma`.
- **Conexión Prisma:** Configurada mediante `db.orm` consumiendo las credenciales de `DATABASE_URL`.
- **Generación de Contrato:** Genera los artefactos de datos y clientes utilizando el script:

```bash
npm run contract:emit
```
````

---

## 2. Seguridad y Variables de Entorno (`.env`)

El archivo `.env` administra las credenciales sensibles del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/creativa_estudio"
PORT=3000

```

### Reglas de Seguridad y Buenas Prácticas:

1. **Protección en Git:** El archivo `.env` debe permanecer dentro de `.gitignore` para prevenir exposición de credenciales.
2. **Encriptación:** Uso de **`bcrypt`** para el hasheo de contraseñas de los usuarios antes de persisitir registros en la base de datos.
3. **Integridad Referencial (`Restricciones`):** Las eliminaciones físicas respetan las reglas `onDelete: Restrict` relacionales, rechazando borrados de registros vinculados a proyectos o actividades operativas.

---

## 3. Estado del Desarrollo de Módulos (9/18)

| #   | Módulo                     | Ruta Base                      | Estado                                   | Documentación                |
| --- | -------------------------- | ------------------------------ | ---------------------------------------- | ---------------------------- |
| 1   | **Usuarios**               | `/api/usuarios`                | ✅ 100% Completo (CRUD)                  | `USUARIOS.md`                |
| 2   | **Roles**                  | `/api/roles`                   | ✅ 100% Completo (CRUD)                  | `ROLES.md`                   |
| 3   | **Clientes**               | `/api/clientes`                | ✅ 100% Completo (CRUD + Borrado Lógico) | `CLIENTES.md`                |
| 4   | **Trabajadores**           | `/api/trabajadores`            | ✅ 100% Completo (CRUD)                  | `TRABAJADORES.md`            |
| 5   | **Especialidades**         | `/api/especialidades`          | ✅ 100% Completo (CRUD)                  | `ESPECIALIDADES.md`          |
| 6   | **TrabajadorEspecialidad** | `/api/trabajador-especialidad` | ✅ 100% Completo (CRUD)                  | `TRABAJADOR_ESPECIALIDAD.md` |
| 7   | **Servicios**              | `/api/servicios`               | ✅ 100% Completo (CRUD)                  | `SERVICIOS.md`               |
| 8   | **Etapas**                 | `/api/etapas`                  | ✅ 100% Completo (CRUD)                  | `ETAPAS.md`                  |
| 9   | **Propuestas**             | `/api/propuestas`              | ✅ Documentado / En Proceso de Código    | `PROPUESTAS.md`              |
| 10  | **PropuestaDetalle**       | `/api/propuesta-detalle`       | ⏳ Pendiente                             | --                           |
| 11  | **Proyectos**              | `/api/proyectos`               | ⏳ Pendiente                             | --                           |
| 12  | **ProyectoServicio**       | `/api/proyecto-servicio`       | ⏳ Pendiente                             | --                           |
| 13  | **ProyectoEtapa**          | `/api/proyecto-etapa`          | ⏳ Pendiente                             | --                           |
| 14  | **Asignaciones**           | `/api/asignaciones`            | ⏳ Pendiente                             | --                           |
| 15  | **Actividades**            | `/api/actividades`             | ⏳ Pendiente                             | --                           |
| 16  | **Entregables**            | `/api/entregables`             | ⏳ Pendiente                             | --                           |
| 17  | **Documentos**             | `/api/documentos`              | ⏳ Pendiente                             | --                           |
| 18  | **Pagos**                  | `/api/pagos`                   | ⏳ Pendiente                             | --                           |

---

## 4. Estructura del Proyecto

```text
src/
├── config/
│   └── database.js
├── modules/
│   ├── roles/
│   │   ├── roles.controller.js
│   │   ├── roles.routes.js
│   │   ├── roles.service.js
│   │   └── roles.validation.js
│   ├── usuarios/
│   ├── clientes/
│   ├── trabajadores/
│   ├── especialidades/
│   ├── trabajador-especialidad/
│   ├── servicios/
│   ├── etapas/
│   └── propuestas/
├── prisma/
│   └── contract.prisma
└── app.js

```

---

## 5. Próximos Pasos en la Hoja de Ruta

1. **Desarrollo del Módulo 9 (`Propuestas`):** Implementar la capa lógica, controlador, rutas y validaciones siguiendo las especificaciones de `PROPUESTAS.md`.
2. **Módulo 10 (`PropuestaDetalle`):** Conectar las partidas de servicios cotizados a cada propuesta y habilitar el recálculo automático de `subtotal`, `impuestos` y `total`.
3. **Módulo 11 (`Proyectos`):** Transformación de propuestas aceptadas en proyectos activos de la agencia.

---

## 6. Comandos Principales

- **Iniciar servidor de desarrollo:**

```bash
npm start

```

- **Emitir/Actualizar contrato Prisma:**

```bash
npm run contract:emit

```

```

```
