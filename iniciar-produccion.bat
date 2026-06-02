@echo off
set "BASE=%~dp0"
cd /d "%BASE%"

echo === Compilando backend ===
cd backend
call npm run build
if errorlevel 1 exit /b 1

echo.
echo === Compilando frontend ===
cd ..\frontend
call npm run build
if errorlevel 1 exit /b 1

cd /d "%BASE%"

echo.
echo === Iniciando API con PM2 ===
pm2 delete api-gestion-proyectos 2>nul
pm2 start ecosystem.config.js
pm2 save

echo.
echo Listo. Pasos siguientes:
echo  1. Tener PostgreSQL con la base gestion_proyectos
echo  2. Configurar nginx con el archivo nginx\nginx.conf
echo     (editar la ruta "root" con la ruta completa del proyecto)
echo  3. Iniciar nginx y abrir http://localhost
echo.
echo Comandos utiles PM2: pm2 status  |  pm2 logs  |  pm2 stop api-gestion-proyectos
pause
