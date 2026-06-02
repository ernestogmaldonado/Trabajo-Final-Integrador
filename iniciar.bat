@echo off
set "BASE=%~dp0"

echo Iniciando API (puerto 3000)...
start "Backend" cmd /k "cd /d "%BASE%backend" && npm run start:dev"

timeout /t 6 /nobreak >nul

echo Iniciando web en puerto 4200...
start "Frontend" cmd /k "cd /d "%BASE%frontend" && npm start"

echo.
echo Abrir: http://localhost:4200
echo Usuario: admin  Clave: admin123
pause
