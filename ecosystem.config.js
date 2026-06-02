// PM2 - mantiene la API NestJS en ejecucion
module.exports = {
  apps: [
    {
      name: 'api-gestion-proyectos',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
