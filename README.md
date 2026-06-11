# TP Final - Gestion de Proyectos

Sistema de gestion de clientes, proyectos y tareas.

**Tecnologias:** NestJS, TypeORM, PostgreSQL, Angular, PM2, nginx.

## Como correrlo

1. Levantar PostgreSQL (base `gestion_proyectos`, usuario `postgres` / clave `postgres`, o `docker compose up -d`).
2. Ejecutar **iniciar.bat**
3. Abrir http://localhost:4200

Usuarios: **admin** / **admin123** (ADMIN) y **usuario** / **usuario123** (USUARIO).

> El puerto 3000 debe estar libre (si MySQL lo usa, detenerlo antes).

## Produccion

Ejecutar **iniciar-produccion.bat** (compila y arranca la API con PM2) y configurar nginx con `nginx/nginx.conf`, cambiando la linea `root` por la ruta absoluta a `frontend/dist/frontend/browser`. Luego entrar a http://localhost

## Funcionalidades

- Login con JWT
- ABM de clientes, proyectos (con cliente o interno) y tareas
- Historial de cambios con usuario y fecha
- Roles: solo ADMIN puede dar de baja proyectos/tareas o borrar tareas
- Busqueda por nombre y estado, orden por columna y paginacion en las tablas
- Exportacion a CSV de clientes y proyectos (respeta los filtros)
