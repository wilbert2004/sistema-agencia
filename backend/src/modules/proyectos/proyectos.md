# Documentación Técnica de la API: Módulo de Proyectos

## 📌 Descripción General

El módulo de **Proyectos** gestiona la ejecución operativa del trabajo vendido a un cliente. Actúa como la entidad central que conecta el área comercial (*Clientes y Propuestas*) con la ejecución diaria (*Etapas, Asignaciones, Documentos, Pagos, etc.*).

---

## 📐 Modelo de Datos (`contract.prisma`)

```prisma
model Proyectos {
  idProyecto        Int               @id(map: "pk_proyectos") @default(autoincrement()) @map("id_proyecto")
  idCliente         Int               @map("id_cliente")
  idPropuesta       Int?              @map("id_propuesta")
  nombreProyecto    VarChar(150)      @map("nombre_proyecto")
  descripcion       String?
  fechaInicio       Date              @map("fecha_inicio")
  fechaFinEstimada  Date?             @map("fecha_fin_estimada")
  estado            VarChar(30)       @default("planificacion")
  asignaciones      Asignaciones[]
  documentos        Documentos[]
  pagos             Pagos[]
  proyectoEtapas    ProyectoEtapa[]
  proyectoServicios ProyectoServicio[]
  clientes          Clientes          @relation(fields: [idCliente], references: [idCliente], onDelete: Restrict, map: "fk_proyectos_cliente")
  propuestas        Propuestas?        @relation(fields: [idPropuesta], references: [idPropuesta], onDelete: SetNull, map: "fk_proyectos_propuesta")

  @@index([idCliente], map: "idx_proyectos_cliente")
  @@index([idPropuesta], map: "idx_proyectos_propuesta")
  @@check(expression: "((estado)::text = ANY ((ARRAY['planificacion'::character varying, 'en_progreso'::character varying, 'pausado'::character varying, 'finalizado'::character varying, 'cancelado'::character varying])::text[]))", map: "chk_proyectos_estado")
  @@check(expression: "((fecha_fin_estimada IS NULL) OR (fecha_fin_estimada >= fecha_inicio))", map: "chk_proyectos_fechas")
  @@map("proyectos")
}

```

---

## 🔒 Reglas de Negocio e Integridad

1. **Cliente Obligatorio:** Todo proyecto debe estar vinculado a un `idCliente` existente en la base de datos (`404 Not Found` si no existe).
2. **Propuesta Opcional:** El campo `idPropuesta` es opcional (`NULLable`). Se permite registrar proyectos directos sin cotización previa.
3. **Integridad Cliente - Propuesta:** Si se proporciona un `idPropuesta`, se valida que la propuesta exista Y pertenezca al mismo `idCliente` especificado en la petición.
4. **Coherencia Temporales:** `fechaFinEstimada` debe ser igual o posterior a `fechaInicio` (`fechaFinEstimada >= fechaInicio`).
5. **Estados Permitidos:**
* `planificacion` (por defecto)
* `en_progreso`
* `pausado`
* `finalizado`
* `cancelado`


6. **Protección al Eliminar (`DELETE`):** No se permite la eliminación física de un proyecto si ya cuenta con registros operativos o financieros asociados (`ProyectoEtapa`, `Asignaciones`, `Documentos`, `Pagos`, `ProyectoServicio`).

---

## 🛠️ Especificación de Endpoints (REST API)

### Base Path: `/api/proyectos`

| Método | Endpoint | Descripción | Requiere Body |
| --- | --- | --- | --- |
| `GET` | `/` | Obtener todos los proyectos | No |
| `GET` | `/:id` | Obtener un proyecto por ID | No |
| `POST` | `/` | Crear un nuevo proyecto | Sí |
| `PUT` | `/:id` | Actualizar datos/estado del proyecto | Sí |
| `DELETE` | `/:id` | Eliminar proyecto (si no tiene dependencias) | No |

---

### 1. Obtener todos los proyectos

**`GET /api/proyectos`**

#### Respuesta Exitosa (`200 OK`)

```json
{
  "success": true,
  "message": "Proyectos obtenidos correctamente",
  "data": [
    {
      "idProyecto": 1,
      "idCliente": 5,
      "idPropuesta": 10,
      "nombreProyecto": "Rediseño de Identidad Visual y Sitio Web",
      "descripcion": "Elaboración de marca y desarrollo web en React.",
      "fechaInicio": "2026-10-01",
      "fechaFinEstimada": "2026-12-15",
      "estado": "planificacion"
    }
  ]
}

```

---

### 2. Obtener proyecto por ID

**`GET /api/proyectos/:id`**

#### Respuesta Exitosa (`200 OK`)

```json
{
  "success": true,
  "message": "Proyecto obtenido correctamente",
  "data": {
    "idProyecto": 1,
    "idCliente": 5,
    "idPropuesta": 10,
    "nombreProyecto": "Rediseño de Identidad Visual y Sitio Web",
    "descripcion": "Elaboración de marca y desarrollo web en React.",
    "fechaInicio": "2026-10-01",
    "fechaFinEstimada": "2026-12-15",
    "estado": "planificacion"
  }
}

```

#### Respuestas de Error

* **`400 Bad Request`**: Si el ID no es un entero positivo.
* **`404 Not Found`**: Si el proyecto no existe.

---

### 3. Crear proyecto

**`POST /api/proyectos`**

#### Body (Ejemplo)

```json
{
  "idCliente": 5,
  "idPropuesta": 10,
  "nombreProyecto": "Rediseño de Identidad Visual y Sitio Web",
  "descripcion": "Elaboración de marca y desarrollo web en React.",
  "fechaInicio": "2026-10-01",
  "fechaFinEstimada": "2026-12-15"
}

```

#### Respuesta Exitosa (`201 Created`)

```json
{
  "success": true,
  "message": "Proyecto creado correctamente",
  "data": {
    "idProyecto": 1,
    "idCliente": 5,
    "idPropuesta": 10,
    "nombreProyecto": "Rediseño de Identidad Visual y Sitio Web",
    "descripcion": "Elaboración de marca y desarrollo web en React.",
    "fechaInicio": "2026-10-01",
    "fechaFinEstimada": "2026-12-15",
    "estado": "planificacion"
  }
}

```

#### Respuestas de Error

* **`400 Bad Request`**: Datos de entrada inválidos o fechas incoherentes.
* **`404 Not Found`**: El `idCliente` o el `idPropuesta` especificado no existe.
* **`409 Conflict`**: La propuesta no pertenece al cliente especificado.

---

### 4. Actualizar proyecto

**`PUT /api/proyectos/:id`**

#### Body (Ejemplo de cambio de estado y fecha)

```json
{
  "nombreProyecto": "Rediseño de Identidad Visual y Sitio Web (Fase 1)",
  "fechaFinEstimada": "2026-12-30",
  "estado": "en_progreso"
}

```

#### Respuesta Exitosa (`200 OK`)

```json
{
  "success": true,
  "message": "Proyecto actualizado correctamente",
  "data": {
    "idProyecto": 1,
    "idCliente": 5,
    "idPropuesta": 10,
    "nombreProyecto": "Rediseño de Identidad Visual y Sitio Web (Fase 1)",
    "descripcion": "Elaboración de marca y desarrollo web en React.",
    "fechaInicio": "2026-10-01",
    "fechaFinEstimada": "2026-12-30",
    "estado": "en_progreso"
  }
}

```

---

### 5. Eliminar proyecto

**`DELETE /api/proyectos/:id`**

#### Respuesta Exitosa (`200 OK`)

```json
{
  "success": true,
  "message": "Proyecto eliminado correctamente"
}

```

#### Respuestas de Error

* **`400 Bad Request`**: El proyecto no se puede eliminar porque ya posee registros operativos/financieros asociados (etapas, asignaciones, pagos, etc.).
* **`404 Not Found`**: El proyecto no existe.

---

## 📂 Arquitectura de Capas

```text
src/modules/proyectos/
├── proyectos.validation.js  # Validación HTTP y formateo de datos
├── proyectos.service.js     # Lógica de negocio y consultas Prisma
├── proyectos.controller.js  # Manejo de req/res y códigos de estado
└── proyectos.routes.js      # Definición de endpoints HTTP

```