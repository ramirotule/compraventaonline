# Propuesta Técnica: CompraVentaOnline.com.ar

Propuesta de arquitectura técnica, modelo de datos y diseño funcional para el marketplace híbrido (B2C/C2C) compraventaonline.com.ar.

---

## 1. Stack Tecnológico & Arquitectura

Proponemos una estructura de **Monorepo** basada en carpetas separadas para simplificar el despliegue inicial y compartir definiciones de TypeScript:

| Componente | Tecnología | Razón de Elección |
|------------|------------|-------------------|
| **Estructura** | Monorepo simple (npm Workspaces) | Facilita la compartición de DTOs/interfaces y la orquestación. |
| **Frontend** | Next.js (App Router) + TS + TailwindCSS | SSR/ISR nativo para indexación SEO y rendimiento óptimo. |
| **Backend** | NestJS + TypeScript | Arquitectura limpia estructurada (DI, módulos, Guards, DTOs). |
| **ORM** | Prisma ORM | Developer experience, migraciones declarativas y tipado estricto. |
| **Base de Datos** | PostgreSQL | Robustez transaccional, soporte nativo de JSONB y Full-Text Search. |
| **Infraestructura** | Docker + Docker Compose | Ambientes de desarrollo y producción reproducibles. |

---

## 2. Modelo de Datos: Catálogo (Producto vs Publicación)

Para evitar duplicación y permitir comparación de precios de distintos vendedores para el mismo artículo, separamos **Producto** (Catalog Item) de **Publicación** (Listing).

### Diagrama Conceptual

```
[Producto (Product)] 1 <------- * [Publicación (Listing)] * -------> 1 [Vendedor (Seller)]
```

### Entidades Core (Esquema Conceptual)

#### Tabla: `Product`
Representa el artículo global en el catálogo.
- `id` (UUID, PK)
- `name` (VARCHAR, indexado para búsquedas)
- `description` (TEXT)
- `category_id` (UUID, FK)
- `brand` (VARCHAR)
- `images` (TEXT[] - URLs de imágenes base del catálogo)
- `attributes` (JSONB - atributos dinámicos como marca, modelo, capacidad)
- `created_at` / `updated_at`

#### Tabla: `Listing`
Representa la oferta específica de un vendedor.
- `id` (UUID, PK)
- `product_id` (UUID, FK a `Product`)
- `seller_id` (UUID, FK a `Seller`)
- `price` (DECIMAL(12,2), indexado)
- `condition` (ENUM: `NEW`, `USED`)
- `stock` (INT)
- `status` (ENUM: `ACTIVE`, `PAUSED`, `CLOSED`, `BLOCKED`)
- `featured_plan` (ENUM: `FREE`, `FEATURED`, `PREMIUM`)
- `images` (TEXT[] - fotos específicas de este artículo, ej: fotos del usado)
- `created_at` / `updated_at`

---

## 3. Modelo de Negocio, Monetización y Destacados

### Tipos de Vendedor (`SellerType`)
- `PERSONAL_SELLER`: Particular (C2C). Límite de publicaciones gratuitas activas simultáneas (ej. máx 5).
- `BUSINESS_SELLER`: Comercio/Empresa (B2C). Acceso a planes de suscripción.

### Planes Comerciales (`BusinessPlan`)
- `FREE_BUSINESS`: Sin costo mensual. Stock limitado de publicaciones activas (ej. máx 10).
- `PRO_BUSINESS`: Costo mensual. Publicaciones ilimitadas, acceso a métricas comerciales básicas.
- `ENTERPRISE`: Costo mensual alto. Carga masiva mediante API, soporte multiusuario y analíticas avanzadas.

### Sistema de Destacados (Módulo `HighlightedProducts`)
Cualquier vendedor puede pagar un extra para destacar una publicación específica.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `listing_id` | UUID (FK) | Relación con la publicación destacada |
| `plan` | ENUM | `FREE`, `FEATURED`, `PREMIUM` |
| `start_date` | TIMESTAMP | Inicio del periodo contratado |
| `end_date` | TIMESTAMP | Fin del periodo contratado |

### Publicidad Interna (`AdvertisingSystem`)
Espacios publicitarios que no corresponden a publicaciones de productos (ej: banners en página principal de comercios locales).
- Tabla `Advertisements`: `id`, `advertiser_name`, `type` (`BANNER`, `SPONSORED_CARD`), `image_url`, `target_url`, `active` (BOOLEAN), `start_date`, `end_date`.

---

## 4. Sistema de Reputación y Gamificación

### Seller Reputation Engine

El puntaje del vendedor (`SellerScore`) se calcula dinámicamente con una escala de `0 a 100`:

$$\text{Reputación} = \text{Ventas Completadas (Peso: 40\%)} + \text{Calificaciones Positivas (Peso: 60\%)} - \text{Penalización por Reportes}$$

#### Niveles de Reputación (Tiers)
- **Bronce**: 0 - 39 puntos
- **Plata**: 40 - 69 puntos
- **Oro**: 70 - 89 puntos
- **Premium**: 90 - 100 puntos (Requiere antigüedad mínima de 3 meses y al menos 10 ventas).

El nivel otorga insignias visuales distintivas y priorización en el orden de búsqueda orgánica.

---

## 5. Seguridad y Moderación

### Content Moderation Engine
Las publicaciones y productos pasan por un flujo de moderación automática antes de quedar visibles.

```
[Publicación Creada/Editada] 
          ↓
  [Análisis de Texto e Imágenes (IA/Regex/API)]
          ↓
 ┌────────┴────────┐
 ↓                 ↓
[Sospechoso?]     [Limpio] ──> APPROVED (Visible)
 ↓
 ├─> Sí (Grave / Armas, Drogas, etc.) ──> BLOCKED (No visible)
 └─> Sí (Dudoso / Requiere revisión) ──> REVIEW_REQUIRED (Cola de admin)
```

#### Denuncias de la Comunidad (`ReportProduct`)
Los usuarios pueden reportar publicaciones inadecuadas:
- Tabla `ProductReports`: `id`, `reporter_user_id`, `listing_id`, `reason` (`FRAUD`, `ILLEGAL_PRODUCT`, `OFFENSIVE`, `OTHER`), `description`, `status` (`PENDING`, `RESOLVED_APPROVED`, `RESOLVED_BLOCKED`).

---

## 6. Estructura de Categorías

Implementaremos un esquema de **Lista de Adyacencia** (Adjacency List) en la base de datos para soportar subcategorías ilimitadas.

```
Tecnología (Raíz)
  └─ Celulares (Hijo de Tecnología)
  └─ Computadoras (Hijo de Tecnología)
```

### Tabla `Category`
- `id` (UUID, PK)
- `name` (VARCHAR)
- `parent_id` (UUID, FK a `Category`, nullable para categorías raíz)
- `slug` (VARCHAR, para URLs amigables)
- `attributes_schema` (JSONB - define los campos dinámicos obligatorios para esta categoría, ej. memoria RAM, cilindrada, etc.)

---

## 7. Onboarding y Legal
Cada usuario registrado debe aceptar explícitamente los términos del servicio y políticas de privacidad.

### Tabla `TermsAcceptance`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `accepted_terms` (BOOLEAN, default true)
- `accepted_date` (TIMESTAMP)
- `version` (VARCHAR, ej. "v1.0")

---

## Próximo Paso
Procederemos a detallar los contratos funcionales de la API y el diseño de la base de datos en la fase de Especificación (`openspec/02-spec.md`).
