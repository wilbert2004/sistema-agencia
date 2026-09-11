# Documentación General del Backend (`BACKEND.md`)

## Visión General

El backend de **“sistema-agencia”** está construido con Node.js, Express, TypeScript y Prisma ORM, conectado a una base de datos PostgreSQL llamada `creativa_estudio`. Maneja una arquitectura por módulos desacoplados con patrón **Routes - Validation - Controller - Service**.

---

## 1. Configuración de Base de Datos y Prisma

- **Base de datos:** PostgreSQL (`creativa_estudio` en `localhost:5432`).
- **Ubicación del esquema:** `backend/src/prisma/contract.prisma`.
- **Conexión Prisma:** Configurada en `backend/src/prisma/db.ts` utilizando la variable de entorno `DATABASE_URL`.
- **Generación del contrato:** Ejecutada desde la carpeta `backend/`:

```bash
npm run contract:emit

```

Genera los artefactos de tipos `contract.json` y `contract.d.ts`.

---

## 2. Seguridad y Variables de Entorno (`.env`)

El archivo `backend/.env` maneja datos sensibles de conexión:
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

```env


```

### Reglas de Seguridad Obligatorias:

1. **Protección en Git:** Asegúrate de que `backend/.gitignore` contenga la línea `.env` para evitar que las credenciales se suban al repositorio público/privado de GitHub.
2. **Encriptación de Contraseñas:** Se utiliza **`bcrypt`** para el hasheo de contraseñas de los usuarios antes de persistir en la columna `contrasenaHash`:

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt

```

---

## 3. Estado de Módulos Desarrollados

Actualmente el sistema cuenta con los módulos base de administración e identidad terminados:

| Módulo           | Ruta Base           | Estado                                   | Documentación     |
| ---------------- | ------------------- | ---------------------------------------- | ----------------- |
| **Roles**        | `/api/roles`        | ✅ 100% Completo (CRUD)                  | `ROLES.md`        |
| **Usuarios**     | `/api/usuarios`     | ✅ 100% Completo (CRUD + Borrado Lógico) | `USUARIOS.md`     |
| **Clientes**     | `/api/clientes`     | ✅ 100% Completo (CRUD + Borrado Lógico) | `CLIENTES.md`     |
| **Trabajadores** | `/api/trabajadores` | ⏳ GET, GET /:id y POST terminados       | `TRABAJADORES.md` |

---

## 4. Estructura de Carpetas del Proyecto

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js (o db.ts)
│   ├── modules/
│   │   ├── roles/
│   │   ├── usuarios/
│   │   ├── clientes/
│   │   └── trabajadores/
│   ├── prisma/
│   │   ├── contract.prisma
│   │   ├── contract.json
│   │   ├── contract.d.ts
│   │   └── db.ts
│   └── app.js (o index.ts)
├── .env
├── .gitignore
├── prisma.config.ts
└── package.json

```

---

## 5. Respuestas a la Guía de Integración

### 1 & 2. Prueba de Conexión y Consulta con Prisma

Puedes verificar la base de datos creando un script rápido `backend/src/test-db.ts`:

```typescript
import { db } from "./prisma/db";

async function main() {
  try {
    const totalUsuarios = await db.orm.public.Usuarios.count();
    console.log(" Conexión exitosa. Total de usuarios en BD:", totalUsuarios);
  } catch (error) {
    console.error(" Error de conexión a PostgreSQL:", error);
  }
}

main();
```

### 3. Conexión del Backend con el Frontend

Para permitir que la aplicación cliente (React, Next.js, etc.) se comunique sin bloqueos de seguridad del navegador, habilita **CORS** en `app.js`:

```bash
npm install cors

```

```javascript
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json());
```

### 4. Siguientes Módulos a Construir

Para completar las 18 tablas según el archivo `contract.prisma`, la hoja de ruta sugerida es:

1. Finalizar `PUT` y `DELETE` de **Trabajadores**.
2. **Módulo de Autenticación (`POST /api/auth/login`)**: Comparar contraseñas hasheadas con `bcrypt` y generar un Token JWT.
3. **Módulo de Proyectos y Propuestas**: Vincular clientes con sus respectivos proyectos.
4. **Módulo de Tareas, Actividades y Entregables**: Núcleo operativo del seguimiento de entregas.

---

## 6. Comandos Principales

Todos los comandos deben ejecutarse desde la carpeta `backend/`:

- **Compilar/Generar contrato Prisma:** `npm run contract:emit`
- **Iniciar en desarrollo:** `npm start`
- **Verificar tipos TypeScript:** `npx tsc --noEmit`
