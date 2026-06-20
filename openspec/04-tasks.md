# Planificación de Tareas: Work Units e Implementación

Este documento detalla el desglose de tareas técnicas para la inicialización y estructuración del monorepo.

---

## 1. Review Workload Forecast

- **Total estimación de líneas modificadas**: ~800 líneas (debido a archivos autogenerados por Next.js y NestJS).
- **Riesgo de carga cognitiva**: Alto (por la cantidad de archivos iniciales).
- **Estrategia de entrega (Delivery Strategy)**: `auto-chain` (segmentar en PRs/commits por Work Unit para facilitar la revisión paso a paso).
- **Estrategia de cadena (Chain Strategy)**: `stacked-to-main` (cada Work Unit se une a `main` de manera secuencial tras verificación).

---

## 2. Unidades de Trabajo (Work Units)

### Work Unit 1: Inicialización de la Raíz y Configuración del Monorepo
- **Descripción**: Crear la estructura del monorepo mediante npm workspaces y configurar archivos globales de TypeScript y linting.
- **Archivos Modificados/Creados**:
  - `[NEW] package.json` (Raíz, configurado con workspaces para `frontend` y `backend`)
  - `[NEW] tsconfig.json` (Configuraciones base de TypeScript)
- **Estado de Inicio**: Repositorio limpio con `docs/` y `.gitignore`.
- **Estado de Fin**: Estructura de workspaces lista para instalar dependencias de forma centralizada.
- **Verificación**: Ejecutar `npm install` y verificar la creación de symlinks en node_modules.
- **Commit sugerido**: `chore: setup monorepo workspaces and root typescript configurations`

---

### Work Unit 2: Bootstrap del Backend (NestJS + Prisma)
- **Descripción**: Crear el esqueleto de NestJS en la carpeta `backend/` e instalar Prisma.
- **Archivos Modificados/Creados**:
  - `[NEW] backend/package.json`
  - `[NEW] backend/src/*` (Archivos autogenerados de NestJS)
  - `[NEW] backend/prisma/schema.prisma` (Modelo básico de base de datos)
- **Estado de Inicio**: Carpeta `backend` vacía.
- **Estado de Fin**: Servidor NestJS básico funcionando y compilando con Prisma configurado.
- **Verificación**:
  - `npm run build` en el backend.
  - Ejecutar tests unitarios por defecto (`npm run test`).
- **Commit sugerido**: `feat(backend): bootstrap nestjs application and prisma schema`

---

### Work Unit 3: Bootstrap del Frontend (Next.js + Tailwind)
- **Descripción**: Crear el proyecto de Next.js en la carpeta `frontend/` y configurar TailwindCSS.
- **Archivos Modificados/Creados**:
  - `[NEW] frontend/package.json`
  - `[NEW] frontend/src/app/*` (Estructura base del App Router)
  - `[NEW] frontend/tailwind.config.ts`
- **Estado de Inicio**: Carpeta `frontend` vacía.
- **Estado de Fin**: Aplicación Next.js básica que levanta en el puerto 3000 con Tailwind activo.
- **Verificación**:
  - `npm run build` en el frontend.
  - Abrir y compilar la página principal sin errores de TypeScript.
- **Commit sugerido**: `feat(frontend): bootstrap nextjs application with tailwindcss`

### Work Unit 4: Registro de Usuarios y Aceptación de Términos (Fase 1)
- **Descripción**: Implementar registro, login y guardado de versión de Términos y Condiciones en el Backend.
- **Estado de Inicio**: Work Unit 2 finalizada.
- **Estado de Fin**: Endpoint `POST /api/sellers` validando la aceptación de términos.
- **Verificación**: Correr llamadas HTTP locales.
- **Commit sugerido**: `feat(backend): implement user authentication and terms acceptance`

### Work Unit 5: Registro y Tiers de Vendedores (Fase 1)
- **Descripción**: Endpoints para crear perfil Seller (Personal/Business) y recuperar su reputación.
- **Estado de Inicio**: Work Unit 4 finalizada.
- **Estado de Fin**: Endpoint `POST /api/sellers` y `GET /api/sellers/:id/reputation` activos.
- **Verificación**: Tests unitarios en el controlador de Sellers.
- **Commit sugerido**: `feat(backend): implement seller registration and reputation profile`

### Work Unit 6: Carga del Árbol de Categorías (Fase 2)
- **Descripción**: Crear script de seed de Prisma con las categorías iniciales (Tecnología, Hogar, Campo, etc.) y campos JSONB de atributos.
- **Estado de Inicio**: Base de datos vacía.
- **Estado de Fin**: Categorías creadas en DB.
- **Verificación**: Ejecutar script seed de Prisma.
- **Commit sugerido**: `feat(backend): seed category tree with dynamic attributes schema`

### Work Unit 7: Catálogo de Productos y Ofertas (Fase 2)
- **Descripción**: Crear endpoints para crear productos globales y dar de alta publicaciones (Listings) de vendedores con precio, stock e imágenes.
- **Estado de Inicio**: Categorías creadas.
- **Estado de Fin**: Endpoints `POST /api/products` y `POST /api/listings` funcionales con DTO validation.
- **Verificación**: Crear producto y publicación y verificar persistencia en PostgreSQL.
- **Commit sugerido**: `feat(backend): implement product catalog and listing creation`

### Work Unit 8: Buscador y Búsqueda con Filtros (Fase 2)
- **Descripción**: Endpoint `GET /api/listings` con búsqueda por texto y filtros dinámicos (categoría, precio, condición).
- **Estado de Inicio**: Base de datos poblada de prueba.
- **Estado de Fin**: Búsqueda optimizada por query params.
- **Verificación**: Querying local.
- **Commit sugerido**: `feat(backend): implement search endpoint for listings with filters`

### Work Unit 9: Moderación Automática y Reportes (Fase 3)
- **Descripción**: Servicio de filtro por palabras prohibidas y lógica de denuncias de comunidad.
- **Estado de Inicio**: Work Unit 8 finalizada.
- **Estado de Fin**: Filtro automático bloquea listings con armas/drogas. Endpoint `POST /api/reports` guarda reportes.
- **Verificación**: Testeo con títulos no permitidos.
- **Commit sugerido**: `feat(backend): implement content moderation and community reports`

### Work Unit 10: Motor de Reputación Dinámica (Fase 3)
- **Descripción**: Listener de eventos que actualiza `SellerScore` (0-100) y asigna Tiers (Bronce/Plata/Oro/Premium).
- **Estado de Inicio**: Work Unit 9 finalizada.
- **Estado de Fin**: El score aumenta por venta exitosa y disminuye por reportes o negativas.
- **Verificación**: Tests unitarios de cálculo de score.
- **Commit sugerido**: `feat(backend): implement seller reputation engine`

### Work Unit 11: Destacados y Publicidad (Fase 4)
- **Descripción**: Modelos y endpoints para destacados (Premium/Featured) y anuncios locales.
- **Estado de Inicio**: Base de datos lista.
- **Estado de Fin**: Endpoints de destacados funcionando.
- **Verificación**: Listar publicaciones destacadas primero.
- **Commit sugerido**: `feat(backend): implement advertising and listing highlights`

### Work Unit 12: Frontend Layout y Sistema de Diseño (Fase 5)
- **Descripción**: Crear estructura base, CSS de Tailwind, header, footer e inicio con destacados en Next.js.
- **Estado de Inicio**: Next.js bootstrap.
- **Estado de Fin**: Home terminada y responsive con componentes Atoms/Molecules/Organisms.
- **Verificación**: Visualización en múltiples pantallas (Mobile First).
- **Commit sugerido**: `feat(frontend): build design system and home page`

### Work Unit 13: Buscador Frontend y Dashboard Vendedor (Fase 5)
- **Descripción**: Página `/search` conectada con API y `/dashboard` del vendedor para administrar catálogo y métricas.
- **Estado de Inicio**: Work Unit 12 finalizada.
- **Estado de Fin**: Flujo completo de búsqueda y panel funcional.
- **Verificación**: Crear publicación desde UI y verla en la búsqueda.
- **Commit sugerido**: `feat(frontend): integrate search and seller dashboard`

---

## Próximo Paso
Comenzaremos la implementación secuencial de las unidades de trabajo en la fase de Ejecución (`openspec/05-apply-progress.md`).
