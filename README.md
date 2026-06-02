# TP Final - Gestion de Proyectos

Sistema de gestion de clientes, proyectos y tareas.

**Tecnologias:** NestJS, TypeORM, PostgreSQL, Angular, PM2, nginx.

## Requisitos

- Node.js 18+
- PostgreSQL (o `docker compose up -d` en la carpeta del proyecto)
- Para produccion: [PM2](https://pm2.keymetrics.io/) y [nginx](https://nginx.org/)

Base de datos: `gestion_proyectos` — usuario `postgres` / clave `postgres`.

---

## Desarrollo (dia a dia)

1. Levantar PostgreSQL.
2. Ejecutar **iniciar.bat**
3. Abrir http://localhost:4200
4. Login: **admin** / **admin123**

La API corre en http://localhost:3000/api

> El puerto 3000 debe estar libre (si MySQL lo usa, detenerlo antes).

---

## Produccion (PM2 + nginx)

### 1. Compilar y arrancar la API con PM2

Ejecutar **iniciar-produccion.bat** o manualmente:

```bash
cd backend && npm run build
cd ../frontend && npm run build
cd ..
pm2 start ecosystem.config.js
pm2 status
```

La API queda en el puerto **3000** (archivo `ecosystem.config.js`).

### 2. Configurar nginx

- Copiar o referenciar `nginx/nginx.conf` en tu instalacion de nginx.
- **Importante:** en `nginx.conf`, cambiar la linea `root` por la ruta absoluta a:

  `frontend/dist/frontend/browser`

  Ejemplo Windows:

  ```
  root C:/Users/tu-usuario/.../tp final/frontend/dist/frontend/browser;
  ```

- Reiniciar nginx y entrar a **http://localhost**

nginx envia `/api` al backend (PM2) y el resto al Angular compilado.

### 3. Docker (solo PostgreSQL, opcional)

```bash
docker compose up -d
```

---

## Estructura

| Carpeta / archivo      | Uso                          |
|------------------------|------------------------------|
| `backend/`             | API NestJS + TypeORM         |
| `frontend/`            | App Angular                  |
| `ecosystem.config.js`  | Configuracion PM2            |
| `nginx/nginx.conf`     | Reverse proxy                |
| `docker-compose.yml`   | PostgreSQL en contenedor     |
| `iniciar.bat`          | Desarrollo rapido            |
| `iniciar-produccion.bat` | Build + PM2                |

## Funcionalidades

- Login con JWT
- ABM de clientes (estados ACTIVO / BAJA)
- ABM de proyectos (con cliente o interno)
- Tareas por proyecto
