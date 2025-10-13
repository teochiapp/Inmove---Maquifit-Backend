# 🚀 Despliegue del Backend en Coolify

## Configuración Requerida

### 1. Build Settings
```
Build Pack: Node.js
Node Version: 20
Build Command: npm ci && npm run build
Start Command: npm run start
Port: 1337
```

### 2. Variables de Entorno (TODAS son obligatorias)

```bash
# Node Environment
NODE_ENV=production

# Server
HOST=0.0.0.0
PORT=1337

# URLs del Backend
STRAPI_ADMIN_BACKEND_URL=https://admin.inmove.com.ar
STRAPI_BACKEND_URL=https://admin.inmove.com.ar

# Strapi Secrets (GENERA TUS PROPIOS VALORES)
APP_KEYS=genera_un_valor_largo_y_aleatorio_aqui
API_TOKEN_SALT=genera_un_valor_largo_y_aleatorio_aqui
ADMIN_JWT_SECRET=genera_un_valor_largo_y_aleatorio_aqui
TRANSFER_TOKEN_SALT=genera_un_valor_largo_y_aleatorio_aqui
JWT_SECRET=genera_un_valor_largo_y_aleatorio_aqui

# Base de datos (SQLite por defecto - datos se pierden en redeploy)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Para producción, usar MySQL o PostgreSQL (ver DATABASE-SETUP.md)
```

### 3. Generar Secrets Seguros

Puedes generar valores seguros con Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ejecuta este comando 5 veces para generar cada secret.

### 4. Dominio
- Domain: `admin.inmove.com.ar`
- SSL: Habilitado (Let's Encrypt)

## Verificación

Después del deploy, verifica:

1. Backend: `https://admin.inmove.com.ar`
2. Admin: `https://admin.inmove.com.ar/admin`
3. API: `https://admin.inmove.com.ar/api/productos`

## Solución de Problemas

### Error 404
- Verifica que el puerto 1337 esté expuesto
- Verifica que TODAS las variables de entorno estén configuradas
- Revisa los logs en Coolify

### Error 502
- El backend no está corriendo
- Verifica el comando de start
- Revisa los logs para ver errores de Strapi

### Error de SSL
- Espera 5-10 minutos después de configurar el dominio
- Coolify debe generar el certificado Let's Encrypt automáticamente

## 📚 Documentación Adicional

- **[DATABASE-SETUP.md](./DATABASE-SETUP.md)** - Configuración de bases de datos para producción

