# 🗄️ Configuración de Base de Datos - Maquifit Backend

Este proyecto soporta múltiples tipos de base de datos para diferentes entornos.

## 📋 Bases de Datos Soportadas

### ✅ SQLite (Desarrollo Local)
- **Driver**: `better-sqlite3`
- **Uso**: Desarrollo local por defecto
- **Configuración**: Automática

### ✅ MySQL (Producción)
- **Driver**: `mysql2`
- **Uso**: Producción recomendada
- **Configuración**: Requiere variables de entorno

### ✅ PostgreSQL (Producción Alternativa)
- **Driver**: `pg`
- **Uso**: Producción alternativa
- **Configuración**: Requiere variables de entorno

## 🔧 Configuración por Variables de Entorno

### SQLite (Desarrollo)
```bash
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### MySQL (Producción)
```bash
DATABASE_CLIENT=mysql
DATABASE_HOST=tu-servicio-mysql
DATABASE_PORT=3306
DATABASE_NAME=tu-base-de-datos
DATABASE_USERNAME=tu-usuario
DATABASE_PASSWORD=tu-password
DATABASE_SSL=false
```

### PostgreSQL (Producción)
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=tu-servicio-postgres
DATABASE_PORT=5432
DATABASE_NAME=tu-base-de-datos
DATABASE_USERNAME=tu-usuario
DATABASE_PASSWORD=tu-password
DATABASE_SSL=false
```

## 🚀 Configuración en Coolify

### Paso 1: Crear Base de Datos
1. En Coolify, crear un nuevo servicio de base de datos
2. Elegir MySQL o PostgreSQL según preferencia
3. Configurar usuario y contraseña

### Paso 2: Configurar Variables de Entorno
1. En tu aplicación backend, ir a "Environment Variables"
2. Agregar las variables correspondientes según el tipo de base de datos
3. Usar el nombre interno del servicio como `DATABASE_HOST`

### Paso 3: Configurar Volúmenes Persistentes
Para preservar archivos subidos:
- **Source Path**: `/data/strapi-uploads`
- **Destination Path**: `/app/public/uploads`

### Paso 4: Redeploy
1. Guardar todas las configuraciones
2. Hacer redeploy de la aplicación
3. Verificar que funciona correctamente

## ⚠️ Consideraciones Importantes

### Persistencia de Datos
- **SQLite**: Los datos se pierden en redeploys (solo para desarrollo)
- **MySQL/PostgreSQL**: Los datos persisten automáticamente
- **Archivos**: Requieren volumen persistente para `/app/public/uploads`

### Seguridad
- Nunca subir variables de entorno a Git
- Usar contraseñas seguras para bases de datos
- Configurar SSL en producción si es necesario

### Backup
- Configurar backups automáticos en Coolify para bases de datos
- Considerar backups externos para datos críticos

## 🔍 Solución de Problemas

### Error "Cannot connect to database"
- Verificar que el servicio de base de datos esté corriendo
- Confirmar que las variables de entorno sean correctas
- Verificar que el driver correspondiente esté instalado

### Error "Module not found"
- El driver de la base de datos no está instalado
- Verificar que `package.json` incluya `mysql2` o `pg`

### Datos se pierden en redeploy
- Usar MySQL/PostgreSQL en lugar de SQLite
- Configurar volúmenes persistentes para archivos

## 📚 Referencias

- [Strapi Database Configuration](https://docs.strapi.io/dev-docs/configurations/database)
- [Coolify Documentation](https://coolify.io/docs)
- [MySQL2 Driver](https://github.com/sidorares/node-mysql2)
- [PostgreSQL Driver](https://node-postgres.com/)






