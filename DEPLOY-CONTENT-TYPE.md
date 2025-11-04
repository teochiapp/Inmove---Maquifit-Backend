# 🚀 Deploy del Content Type `pago-pendiente`

## ✅ Archivos Creados (Verificado)

```
maquifit-backend/src/api/pago-pendiente/
├── content-types/
│   └── pago-pendiente/
│       └── schema.json           ← Estructura de la tabla
├── controllers/
│   └── pago-pendiente.js         ← Lógica de guardado/recuperación
├── routes/
│   └── pago-pendiente.js         ← Endpoints de la API
└── services/
    └── pago-pendiente.js         ← Servicios base
```

---

## 🔄 Opción 1: Deploy con Git (Recomendado)

### Paso 1: Verificar estado de Git

```bash
cd "C:\Users\teorh\OneDrive\Desktop\React Projects\maqufiit\maquifit-backend"
git status
```

**Deberías ver:**
```
Untracked files:
  src/api/pago-pendiente/
```

### Paso 2: Agregar los archivos

```bash
# Agregar todo el directorio pago-pendiente
git add src/api/pago-pendiente/

# Verificar que se agregó
git status
```

**Deberías ver:**
```
Changes to be committed:
  new file:   src/api/pago-pendiente/content-types/pago-pendiente/schema.json
  new file:   src/api/pago-pendiente/controllers/pago-pendiente.js
  new file:   src/api/pago-pendiente/routes/pago-pendiente.js
  new file:   src/api/pago-pendiente/services/pago-pendiente.js
```

### Paso 3: Commit

```bash
git commit -m "feat: Agregar content type pago-pendiente para guardar datos antes del pago"
```

### Paso 4: Push al repositorio

```bash
# Si usas rama main
git push origin main

# Si usas rama master
git push origin master
```

---

## 🌐 Opción 2A: Deploy en Coolify (Si usas Coolify)

### Paso 1: Push a Git (como arriba)

```bash
git add src/api/pago-pendiente/
git commit -m "feat: Agregar content type pago-pendiente"
git push origin main
```

### Paso 2: Redeploy en Coolify

**Opción A - Redeploy Automático:**
- Coolify detectará el push automáticamente
- Espera 2-5 minutos

**Opción B - Redeploy Manual:**
1. Ve a tu panel de Coolify
2. Encuentra tu proyecto `maquifit-backend`
3. Click en **"Redeploy"** o **"Force Deploy"**
4. Espera a que termine el build

### Paso 3: Verificar en Producción

```bash
# Verifica que la API está disponible
curl https://admin.inmove.com.ar/api/pagos-pendientes/guardar
```

### Paso 4: Configurar Permisos en Producción

1. Ve a: `https://admin.inmove.com.ar/admin`
2. Login con tu usuario
3. **Settings** → **Users & Permissions** → **Roles** → **Public**
4. Marca los permisos:
   - ✅ `pago-pendiente.guardar`
   - ✅ `pago-pendiente.recuperar`
   - ✅ `pago-pendiente.actualizarPago`
5. **Save**

---

## 🌐 Opción 2B: Deploy en Vercel/Railway/Render

### Vercel

```bash
# 1. Push a git
git add src/api/pago-pendiente/
git commit -m "feat: Content type pago-pendiente"
git push origin main

# 2. Vercel detecta y redeploya automáticamente
# O manualmente:
vercel --prod
```

### Railway

```bash
# 1. Push a git
git push origin main

# 2. Railway redeploya automáticamente
# O en el dashboard:
# - Ve a tu proyecto
# - Click en "Deploy"
```

### Render

```bash
# 1. Push a git
git push origin main

# 2. Render redeploya automáticamente
# O en el dashboard:
# - Manual Deploy
```

---

## 🔍 Opción 3: Deploy Manual (FTP/SFTP)

Si no usas Git o CI/CD:

### Paso 1: Comprimir archivos

```bash
# En Windows PowerShell
Compress-Archive -Path "C:\Users\teorh\OneDrive\Desktop\React Projects\maqufiit\maquifit-backend\src\api\pago-pendiente" -DestinationPath "pago-pendiente.zip"
```

### Paso 2: Subir via FTP/SFTP

1. Conecta a tu servidor via FTP/SFTP
2. Navega a: `/path/to/maquifit-backend/src/api/`
3. Sube la carpeta `pago-pendiente` completa
4. Reinicia Strapi en el servidor

### Paso 3: Reiniciar Strapi

```bash
# SSH a tu servidor
ssh user@your-server.com

# Navega al directorio del backend
cd /path/to/maquifit-backend

# Reinicia (depende de cómo está configurado)
pm2 restart strapi
# o
npm run start
```

---

## ✅ Verificación Post-Deploy

### 1. Verificar que Strapi inició correctamente

```bash
# En local (desarrollo)
http://localhost:1337/admin

# En producción
https://admin.inmove.com.ar/admin
```

**Deberías ver "Pago Pendiente" en el menú lateral**

### 2. Probar los endpoints

```bash
# Test endpoint guardar (POST)
curl -X POST https://admin.inmove.com.ar/api/pagos-pendientes/guardar \
  -H "Content-Type: application/json" \
  -d '{
    "external_reference": "test_123",
    "client_data": {
      "nombre": "Test",
      "mail": "test@test.com",
      "telefono": "123456"
    },
    "plan_data": {
      "id": 1,
      "title": "Plan Test",
      "price": 1000
    }
  }'

# Test endpoint recuperar (GET)
curl https://admin.inmove.com.ar/api/pagos-pendientes/recuperar/test_123
```

### 3. Verificar permisos

En el Admin Panel:
- Settings → Users & Permissions → Roles → Public
- Verifica que `pago-pendiente` tenga los 3 métodos habilitados

---

## 🐛 Troubleshooting

### Error: "Pago Pendiente no aparece en el admin"

**Causa:** Strapi no detectó el content type

**Solución:**
```bash
# En el servidor
cd /path/to/maquifit-backend
npm run build
npm run start
```

### Error: "403 Forbidden" al llamar a la API

**Causa:** Faltan permisos

**Solución:**
1. Admin Panel → Settings → Users & Permissions → Roles → Public
2. Habilitar los 3 métodos de pago-pendiente
3. Save

### Error: "Cannot find module pago-pendiente"

**Causa:** Los archivos no se subieron correctamente

**Solución:**
1. Verifica que los 4 archivos existen en el servidor:
   - schema.json
   - controller.js
   - routes.js
   - services.js
2. Reinicia Strapi

### Error: "Database table doesn't exist"

**Causa:** Strapi no creó la tabla

**Solución:**
```bash
# Strapi crea tablas automáticamente al iniciar
# Solo asegúrate de reiniciar después de subir los archivos
pm2 restart strapi
```

---

## 📋 Checklist de Deploy

### Pre-Deploy
- [ ] Archivos creados localmente
- [ ] Strapi funciona en local
- [ ] Content type visible en admin local
- [ ] Permisos configurados en local
- [ ] Testing local exitoso

### Durante Deploy
- [ ] Git add + commit + push
- [ ] Redeploy ejecutado (Coolify/Vercel/Railway)
- [ ] Build sin errores
- [ ] Strapi inició correctamente

### Post-Deploy
- [ ] Content type visible en admin de producción
- [ ] Permisos configurados en producción
- [ ] Endpoint `/guardar` responde 200
- [ ] Endpoint `/recuperar` responde 200
- [ ] Frontend puede guardar datos
- [ ] Frontend puede recuperar datos

---

## 🚀 Comandos Rápidos

### Para Coolify/Git:
```bash
cd "C:\Users\teorh\OneDrive\Desktop\React Projects\maqufiit\maquifit-backend"
git add src/api/pago-pendiente/
git commit -m "feat: Content type pago-pendiente para sistema de pagos"
git push origin main
```

### Verificar en Producción:
```bash
# Ver si está disponible
curl https://admin.inmove.com.ar/api/pagos-pendientes

# Si devuelve algo (aunque sea error 403), está deployado
```

---

## 💡 Recomendación

1. **Haz commit local primero** para no perder cambios
2. **Prueba en staging/dev** si tienes ambiente de pruebas
3. **Configura permisos** inmediatamente después del deploy
4. **Prueba con Postman/curl** antes de probar con el frontend

---

¿Usas **Coolify**, **Vercel**, **Railway** u otro servicio? Dime y te doy instrucciones específicas.



