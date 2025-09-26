# 🛒 Compraventa Online

> **Una plataforma moderna de compraventa con autenticación, validación avanzada y experiencia de usuario excepcional**

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Descripción

**Compraventa Online** es una aplicación web moderna desarrollada con React y TypeScript que permite a los usuarios publicar y navegar productos de compraventa. La plataforma incluye un sistema completo de autenticación, validación de contenido, y una experiencia de usuario optimizada con componentes reutilizables y diseño responsivo.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación**
- Login y registro de usuarios con validación completa
- Verificación por email y SMS simulada
- Contexto de autenticación global con React Context
- Protección de rutas y acciones sensibles

### 📅 **Date Picker Avanzado**
- Implementación de `react-datepicker` con localización española
- Validación de edad (mayor de 18 años)
- Interfaz personalizada que sigue el diseño de la aplicación
- Dropdowns de año y mes para navegación rápida

### 🎨 **Sistema de Modales Universal**
- Modal reutilizable para múltiples contextos (contacto, reportes, autenticación)
- Efectos glassmorphism con backdrop blur
- Animaciones suaves y transiciones
- Componente `UniversalModal` centralizado

### 🛡️ **Validación de Contenido**
- Hook personalizado `useContentValidation` para detectar contenido inapropiado
- Validación en tiempo real de publicaciones
- Modal de advertencia con políticas de contenido
- Sistema de palabras prohibidas configurable

### 🏪 **Gestión de Productos**
- Catálogo de productos con navegación fluida
- Productos destacados en homepage con badges animados
- Detalles de producto con galería de imágenes
- Filtros y búsqueda (en desarrollo)

### 📱 **Diseño Responsivo**
- Interfaz completamente adaptable a dispositivos móviles
- Navbar responsive con menú hamburguesa
- Grid layouts optimizados para diferentes pantallas
- Componentes con hover effects y microinteracciones

## 🛠️ Tecnologías Utilizadas

### **Frontend Core**
- **React 18.3.1** - Biblioteca de UI con hooks modernos
- **TypeScript 5.5.3** - Tipado estático para mayor robustez
- **Vite 5.4.1** - Build tool ultrarrápido con HMR

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Framework de CSS utility-first
- **Custom CSS** - Estilos personalizados para componentes específicos
- **Responsive Design** - Mobile-first approach

### **Routing & Navigation**
- **React Router v6** - Enrutamiento declarativo
- **Link Components** - Navegación SPA optimizada

### **Formularios & Validación**
- **React DatePicker** - Selector de fechas avanzado con localización
- **Date-fns** - Utilidades para manejo de fechas
- **Custom Hooks** - Validación personalizada de formularios

### **Estado & Contexto**
- **React Context API** - Manejo de estado global
- **Custom Hooks** - Lógica reutilizable encapsulada
- **TypeScript Interfaces** - Tipado seguro del estado

### **Desarrollo & Calidad**
- **ESLint** - Linting de código con reglas personalizadas
- **Prettier** - Formateo automático de código
- **Git** - Control de versiones con conventional commits

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Git

### **Pasos de instalación**

```bash
# 1. Clonar el repositorio
git clone https://github.com/ramirotule/compraventaonline.git

# 2. Navegar al directorio del proyecto
cd compraventaonline

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# La aplicación estará disponible en http://localhost:5173
```

### **Scripts disponibles**

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Ejecutar ESLint
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── FeaturedProducts/   # Productos destacados
│   ├── Logo/              # Componente del logo
│   ├── Modal/             # Sistema de modales
│   ├── Navbar/            # Barra de navegación
│   └── ReasonsWeb/        # Razones para usar la web
├── context/             # Context providers
│   ├── AuthContext.tsx     # Contexto de autenticación
│   └── useAuth.ts         # Hook de autenticación
├── hooks/               # Custom hooks
│   └── useContentValidation.ts # Validación de contenido
├── pages/               # Páginas de la aplicación
│   ├── Home.tsx            # Página principal
│   ├── Login.tsx           # Página de login
│   ├── Register.tsx        # Página de registro
│   ├── Products.tsx        # Catálogo de productos
│   ├── ProductDetail.tsx   # Detalle de producto
│   └── Vender.tsx         # Publicar producto
├── services/            # Servicios y APIs
│   └── verificationService.ts # Verificación de email/SMS
├── styles/              # Estilos personalizados
│   └── datepicker.css      # Estilos del date picker
├── types/               # Definiciones de tipos
│   └── producto.ts         # Tipos de productos
├── utils/               # Utilidades
│   └── formatearPrecio.ts  # Formateo de precios
└── data/                # Datos mock
    └── productos.json      # Catálogo de productos
```

## 🔒 Validaciones Implementadas

### **Registro de Usuario**
- ✅ Nombre y apellido (mínimo 2 caracteres)
- ✅ DNI argentino (7-8 dígitos)
- ✅ Fecha de nacimiento (mayor de 18 años)
- ✅ Email con formato válido
- ✅ Teléfono argentino (+54)
- ✅ Dirección completa requerida
- ✅ Contraseña segura (mínimo 8 caracteres, mayúscula, número, símbolo)
- ✅ Confirmación de contraseña
- ✅ Aceptación de términos y condiciones

### **Publicación de Productos**
- ✅ Validación de contenido inapropiado
- ✅ Título y descripción obligatorios
- ✅ Precio numérico válido
- ✅ Categoría seleccionada
- ✅ Imágenes requeridas (simulado)
- ✅ Ubicación geográfica

### **Autenticación**
- ✅ Verificación por email/SMS
- ✅ Códigos de verificación temporales
- ✅ Reenvío de códigos
- ✅ Timeout de sesión

## 🎨 Características de UI/UX

### **Design System**
- **Paleta de colores**: Esquema amber/yellow con grises modernos
- **Tipografía**: Jerarquía clara y legible
- **Espaciado**: Sistema consistente basado en Tailwind
- **Bordes**: Rounded corners y shadows sutiles

### **Interacciones**
- **Hover effects**: En botones y elementos interactivos
- **Focus states**: Anillos de color para accesibilidad
- **Loading states**: Indicadores de carga en formularios
- **Animations**: Transiciones suaves entre estados

### **Accesibilidad**
- **ARIA labels**: En elementos interactivos
- **Keyboard navigation**: Soporte completo de teclado
- **Color contrast**: Cumple estándares WCAG
- **Screen reader friendly**: Estructura semántica

## 🚧 Próximas Características

### **En Desarrollo**
- [ ] Integración con API real
- [ ] Sistema de pagos
- [ ] Chat en tiempo real entre usuarios
- [ ] Notificaciones push
- [ ] Geolocalización avanzada

### **Futuras Mejoras**
- [ ] Progressive Web App (PWA)
- [ ] Modo oscuro
- [ ] Múltiples idiomas
- [ ] Integración con redes sociales
- [ ] Sistema de calificaciones y reseñas

## 👨‍💻 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la branch (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Ramiro** - [@ramirotule](https://github.com/ramirotule)

**Link del proyecto**: [https://github.com/ramirotule/compraventaonline](https://github.com/ramirotule/compraventaonline)

---

⭐ Si te gusta este proyecto, ¡no olvides darle una estrella en GitHub!
