# 🚀 Configuración de Supabase para CompraVenta Online

## 📋 Pasos para configurar tu proyecto Supabase

### 1. Crear cuenta y proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en "New Project"
3. Completa los datos:
   - **Name**: `compraventa-online`
   - **Database Password**: Elige una contraseña segura
   - **Region**: Selecciona la región más cercana a ti
   - **Pricing Plan**: Free (para empezar)

### 2. Ejecutar el script de base de datos

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega todo el contenido del archivo `database/schema.sql`
5. Haz clic en **RUN** para ejecutar el script

### 3. Configurar variables de entorno

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL**
   - **Project API Key** (anon public)

3. Crea un archivo `.env.local` en la raíz de tu proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_aqui
```

### 4. Configurar Storage para imágenes

El bucket `product-images` se crea automáticamente con el script SQL. Si necesitas crearlo manualmente:

1. Ve a **Storage** en Supabase Dashboard
2. Crea un nuevo bucket llamado `product-images`
3. Marca como **Public bucket**
4. Las políticas de seguridad ya están configuradas en el script SQL

### 5. Configurar autenticación

1. Ve a **Authentication** → **Settings**
2. En **Site URL**, configura: `http://localhost:5173` (para desarrollo)
3. En **Redirect URLs**, agrega: `http://localhost:5173/**`

Para producción, actualiza con tu dominio real.

### 6. Configurar email templates (Opcional)

1. Ve a **Authentication** → **Email Templates**
2. Personaliza los templates de:
   - Confirmation
   - Invite
   - Magic Link
   - Recovery

## 🗄️ Estructura de la Base de Datos

### Tablas principales:

#### `profiles`
- Información de usuarios registrados
- Se crea automáticamente cuando un usuario se registra
- Incluye: nombre, apellido, DNI, dirección, etc.

#### `productos`
- Información de productos en venta
- Relacionada con `profiles` (vendedor)
- Incluye: título, descripción, precio, imágenes, ubicación

#### `favoritos`
- Productos marcados como favoritos por usuarios
- Relación many-to-many entre users y productos

#### `mensajes`
- Sistema de mensajería entre compradores y vendedores
- Incluye timestamps y estado de lectura

#### `conversaciones`
- Agrupa mensajes por producto y participantes
- Facilita la gestión de chats

### Políticas de seguridad (RLS):

- ✅ **Profiles**: Los usuarios pueden ver todos los perfiles, pero solo editar el suyo
- ✅ **Productos**: Todos pueden ver productos activos, solo el dueño puede modificar
- ✅ **Favoritos**: Cada usuario ve solo sus favoritos
- ✅ **Mensajes**: Solo los participantes pueden ver la conversación
- ✅ **Storage**: Cualquiera puede ver imágenes, solo el dueño puede modificar

## 🧪 Datos de prueba

Puedes agregar algunos productos de prueba ejecutando:

```sql
-- Insertar usuario de prueba (después de registrarte normalmente)
INSERT INTO productos (titulo, descripcion, precio, categoria, estado, provincia, ciudad, codigo_postal, ubicacion, user_id)
VALUES 
  ('iPhone 14 Pro Max', 'iPhone en excelente estado, batería al 95%', 800000, 'Electrónica', 'Muy bueno', '1', '1', '1900', 'La Plata, Buenos Aires', 'tu-user-id-aqui'),
  ('Bicicleta Mountain Bike', 'Bicicleta rodado 29, poco uso', 150000, 'Deportes', 'Como nuevo', '1', '2', '7600', 'Mar del Plata, Buenos Aires', 'tu-user-id-aqui');
```

## 🔄 Migraciones futuras

Para agregar nuevas características:

1. Crea archivos SQL en `database/migrations/`
2. Ejecuta en el SQL Editor de Supabase
3. Actualiza los tipos TypeScript en `lib/supabase.ts`

## 📊 Monitoring y Analytics

En Supabase Dashboard puedes monitorear:
- **Database**: Uso, performance, logs
- **Auth**: Usuarios registrados, logins
- **Storage**: Espacio usado, archivos subidos
- **API**: Requests, errores, latencia

## 🚨 Límites del plan gratuito

- **Database**: 500MB
- **Storage**: 1GB
- **Bandwidth**: 50GB/mes
- **API requests**: 50.000/mes
- **Usuarios activos**: Ilimitados

Para proyectos en crecimiento, el plan Pro ($25/mes) ofrece mucho más.

## 🛡️ Seguridad

- ✅ Row Level Security habilitado
- ✅ Políticas de acceso configuradas
- ✅ Validaciones en base de datos
- ✅ Encriptación en tránsito y reposo
- ✅ Backup automático diario

## 🔗 Links útiles

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Documentación oficial](https://supabase.io/docs)
- [Guía de React](https://supabase.io/docs/guides/with-react)
- [API Reference](https://supabase.io/docs/reference/javascript)

---

## ⚡ Inicio rápido

```bash
# 1. Instalar dependencias (ya hecho)
npm install

# 2. Configurar .env.local con tus credenciales de Supabase

# 3. Ejecutar el script SQL en Supabase Dashboard

# 4. Iniciar desarrollo
npm run dev
```

¡Tu backend está listo! 🎉