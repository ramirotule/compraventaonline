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

---

## Próximo Paso
Comenzaremos la implementación secuencial de las unidades de trabajo en la fase de Ejecución (`openspec/05-apply-progress.md`).
