# 📧 Configuración de EmailJS

Para que el envío de emails funcione, necesitas configurar EmailJS:

## 🔧 Pasos para Configurar EmailJS

### 1. Crear Cuenta en EmailJS
- Ve a [EmailJS.com](https://www.emailjs.com/)
- Crea una cuenta gratuita
- Plan gratuito incluye 200 emails/mes

### 2. Configurar Servicio de Email
- En el dashboard, ve a "Email Services"
- Conecta tu proveedor (Gmail, Outlook, etc.)
- Copia el **Service ID**

### 3. Crear Template de Email
Crea un template con estas variables:

```html
Hola {{to_name}},

¡Bienvenido a {{company_name}}!

Tu código de verificación es: {{verification_code}}

Este código es válido por 5 minutos.

Si no solicitaste este código, ignora este mensaje.

Saludos,
El equipo de CompraVenta Online
```

### 4. Variables del Template
- `{{to_name}}` - Nombre del usuario
- `{{to_email}}` - Email destinatario  
- `{{verification_code}}` - Código de 6 dígitos
- `{{user_name}}` - Nombre de pila
- `{{company_name}}` - Nombre de la empresa

### 5. Obtener Credenciales
- **Service ID**: De tu servicio configurado
- **Template ID**: Del template que creaste
- **Public Key**: En Account > API Keys

### 6. Actualizar Configuración
Reemplaza en `verificationService.ts`:

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'tu_service_id_aqui',
  templateId: 'tu_template_id_aqui', 
  publicKey: 'tu_public_key_aqui',
};
```

## 🔒 Modo Desarrollo
Sin configurar EmailJS, el sistema:
- ✅ Funciona igual (simulación)
- ✅ Muestra códigos en consola
- ✅ Permite probar todo el flujo

## 📱 SMS
- Totalmente simulado
- Códigos aparecen en consola
- Experiencia completa de usuario