# ROLE

Actuá como un equipo compuesto por:

- Lead Product Manager especializado en marketplaces digitales.
- Software Architect Senior experto en sistemas escalables.
- Staff Full Stack Engineer TypeScript.
- UX/UI Lead especializado en productos SaaS y marketplaces.
- Security Engineer especializado en aplicaciones web.
- DevOps Engineer Cloud Native.

Tu objetivo es diseñar la especificación funcional y reglas de negocio para construir:

# COMPRAVENTAONLINE.COM.AR

Marketplace local de compra y venta de productos nuevos y usados inicialmente enfocado en la provincia de La Pampa, Argentina, con arquitectura preparada para expansión nacional.

La documentación generada será utilizada bajo la metodología:

## Specification-Driven Development (SDD)

Este documento Markdown será el:

- Single Source of Truth (SSOT)
- Contrato funcional entre producto, diseño y desarrollo.
- Fuente de contexto para agentes de IA que generarán código.

Cada requerimiento debe ser:

- Atómico.
- Medible.
- Implementable.
- Sin ambigüedades.
- Independiente cuando sea posible.
- Preparado para automatización mediante IA.


---

# AI DEVELOPMENT SKILLS REQUIRED

Para lograr un resultado profesional, aplicar obligatoriamente las siguientes capacidades:

## UI / UX

Aplicar:

https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Objetivos:

- Diseñar interfaces modernas.
- Mantener consistencia visual.
- Crear sistemas de diseño escalables.
- Aplicar UX patterns de marketplaces exitosos.
- Diseñar flujos optimizados para conversión.
- Priorizar accesibilidad WCAG.
- Mobile First.


## Product Management Skills

Aplicar:

- User Story Mapping.
- Jobs To Be Done.
- Customer Journey Mapping.
- Product Discovery.
- MVP Definition.
- Feature Prioritization.
- Roadmap Evolution.


## Software Architecture Skills

Aplicar:

- Domain Driven Design (DDD).
- Clean Architecture.
- SOLID principles.
- Modular Monolith preparado para Microservicios.
- API First Design.
- Event Driven Architecture cuando corresponda.
- Separation of concerns.


## Frontend Engineering Skills

Aplicar:

- TypeScript strict mode.
- Component driven development.
- Design Systems.
- Atomic Design.
- State management escalable.
- Performance optimization.
- SEO técnico.


## Backend Engineering Skills

Aplicar:

- Arquitectura modular.
- Validación estricta.
- Seguridad OWASP.
- Rate limiting.
- Auditoría.
- Logging estructurado.
- Manejo correcto de errores.


## Database Engineering Skills

Aplicar:

- Modelado relacional.
- Normalización.
- Índices.
- Constraints.
- Auditoría.
- Optimización de queries.


## Security Skills

Aplicar:

- OWASP Top 10.
- Protección contra fraude.
- Control de acceso.
- RBAC.
- Protección de datos personales.
- Moderación de contenido.


## DevOps Skills

Aplicar:

- CI/CD.
- Docker.
- Observabilidad.
- Backups.
- Escalabilidad horizontal.
- Infraestructura reproducible.


---

# 1. ARQUITECTURA Y FRAMEWORK SUGERIDO

Definir el stack tecnológico recomendado considerando:

- Escalabilidad.
- Seguridad.
- Mantenibilidad.
- Velocidad de desarrollo.
- Costos iniciales.

# DISEÑO DE CATÁLOGO Y PUBLICACIONES


El sistema debe separar:


## Producto (Catalog Item)

Representa el artículo.


Ejemplo:

"Taladro Bosch 500W"


Contiene:

- nombre
- descripción
- categoría
- atributos
- imágenes


---

## Publicación (Listing)

Representa la oferta del vendedor.


Contiene:

- vendedor
- precio
- condición
- stock
- estado
- visibilidad


Esto permite que múltiples vendedores puedan ofrecer el mismo producto.


Ejemplo:


Producto:

Taladro Bosch 500W


Publicaciones:

- Ferretería A $120.000
- Ferretería B $115.000
- Usuario particular $80.000 usado


---

La separación debe permitir:

- evitar duplicación.
- mejorar búsquedas.
- comparar ofertas.
- escalar a millones de productos.

## Frontend

Evaluar y recomendar:

- Next.js + TypeScript
- React
- TailwindCSS
- Component Library moderna
- TanStack Query
- Zustand o equivalente


Requerimientos:

- SSR/ISR para SEO.
- Mobile First.
- Performance Core Web Vitals.
- PWA Ready.


## Backend

Recomendar:

- NestJS + TypeScript

Características:

- Arquitectura modular.
- Controllers.
- Services.
- Guards.
- DTO validation.
- Dependency Injection.


## Base de Datos

Usar:

PostgreSQL


Requisitos:

- Relaciones fuertes.
- Transacciones.
- Índices.
- Full Text Search.
- Auditoría.


## Infraestructura

Definir:

- Contenedores Docker.
- CI/CD.
- Storage de imágenes.
- CDN.
- Monitoring.


---

# 2. MODELO DE NEGOCIO Y MONETIZACIÓN


## Usuario Particular

Plan gratuito:

- límite configurable.
- publicaciones individuales.


## Comercio


Planes:

FREE BUSINESS

- cantidad limitada de productos.


PRO BUSINESS

- más publicaciones.
- estadísticas.
- herramientas comerciales.


ENTERPRISE

- carga masiva.
- API.
- integraciones.


## Sistema Premium: Destacados


Crear módulo:

HighlightedProducts


Funciones:

- Pago para aumentar visibilidad.
- Prioridad en búsquedas.
- Aparición en secciones especiales.


Estados:

FREE
FEATURED
PREMIUM


Datos mínimos:

| Campo | Tipo |
|-|-|
| id | uuid |
| product_id | uuid |
| plan | enum |
| start_date | datetime |
| end_date | datetime |


---

# Publicidad interna


Crear módulo independiente:

Advertising System


Separado de publicaciones.


Permitir:

- Empresas locales.
- Comercios.
- Marcas.


Tipos:

- Banner.
- Sponsored card.
- Featured business.


---

# 3. SISTEMA DE REPUTACIÓN Y GAMIFICATION


Crear:

Seller Reputation Engine


Variables:


| Factor | Peso |
|-|-|
| Ventas completadas | configurable |
| Calificaciones positivas | configurable |
| Antigüedad | configurable |
| Reportes negativos | penalización |


Resultado:

SellerScore


Escala:

0-100


Niveles:

Bronce
Plata
Oro
Premium


Mostrar:

- Insignias.
- Color.
- Estadísticas públicas.


---

# Sistema de premios


Crear:

Rewards Module


Beneficios:

- Descuentos.
- Destacados gratis.
- Mayor visibilidad.


---

# 4. SEGURIDAD Y MODERACIÓN


Crear:

Content Moderation Engine


Flujo:


Usuario publica

↓

IA analiza:

- título
- descripción
- imágenes

↓

Resultado:


APPROVED

REVIEW_REQUIRED

BLOCKED


---

Contenido prohibido:


Bloquear:

- Drogas.
- Armas ilegales.
- Explotación sexual.
- Fraude.
- Productos ilegales.
- Material ofensivo.


---

Comunidad:

Sistema:

Report Product


Campos:

| Campo | Tipo |
|-|-|
| user_id | uuid |
| product_id | uuid |
| reason | enum |
| status | enum |


---

# 5. ÁRBOL DE CATEGORÍAS


Diseñar estructura:


## Tecnología

- Celulares
- Computadoras
- Consolas
- Accesorios


## Hogar

- Muebles
- Electrodomésticos
- Decoración


## Vehículos

- Autos
- Motos
- Camiones
- Repuestos


## Campo / Agro

- Maquinaria
- Herramientas
- Animales
- Insumos


## Construcción

- Materiales
- Herramientas


## Moda

- Ropa
- Calzado
- Accesorios


## Servicios

- Profesionales
- Técnicos
- Transporte


## Coleccionables

- Antigüedades
- Hobby


La estructura debe permitir:

- Subcategorías ilimitadas.
- Atributos dinámicos por categoría.
- Filtros personalizados.


---

# 6. LEGAL Y ONBOARDING


Registro obligatorio:


Usuario acepta:

- Términos y condiciones.
- Política de privacidad.
- Reglas de comunidad.


Guardar:


| Campo | Tipo |
|-|-|
| user_id | uuid |
| accepted_terms | boolean |
| accepted_date | datetime |
| version | string |


---

# REQUERIMIENTO FINAL

Todas las decisiones deben priorizar:

1. Seguridad.
2. Escalabilidad.
3. Excelente UX.
4. Conversión.
5. Bajo costo operativo inicial.
6. Facilidad para evolución futura.

La solución debe permitir evolucionar desde:

Marketplace provincial

hacia:

Marketplace nacional argentino.

---

# MODELO DE MARKETPLACE

La plataforma debe ser diseñada como un Marketplace híbrido:

## C2C (Consumer to Consumer)

Usuarios particulares que venden productos nuevos o usados.


Ejemplos:

- Celulares usados.
- Muebles.
- Herramientas.
- Vehículos.
- Artículos personales.


Características:

- Publicaciones individuales.
- Gestión simple.
- Contacto directo comprador/vendedor.
- Reputación basada en transacciones.


---

## B2C (Business to Consumer)

Comercios y empresas podrán utilizar la plataforma como canal de venta digital.


Ejemplos:

- Ferreterías.
- Casas de electrodomésticos.
- Corralones.
- Concesionarias.
- Comercios de ropa.
- Negocios locales.


Las cuentas comerciales deben poder:

- Publicar múltiples productos.
- Administrar catálogo.
- Gestionar stock.
- Manejar precios.
- Administrar variantes.
- Tener múltiples usuarios internos.
- Acceder a estadísticas.


La arquitectura debe permitir evolucionar hacia un modelo similar a:

- marketplace abierto
- tiendas oficiales
- vendedores verificados
- catálogo comercial


---

# TIPOS DE VENDEDORES


La entidad Seller debe soportar:


PERSONAL_SELLER

Usuario particular.


BUSINESS_SELLER

Comercio o empresa.


La lógica de publicaciones debe ser independiente del tipo de vendedor.

# PANEL COMERCIAL


Los comercios deben tener un dashboard propio.


Funciones:


Catálogo:

- crear producto.
- editar producto.
- eliminar producto.


Inventario:

- stock.
- alertas.
- movimientos.


Ventas:

- métricas.
- consultas.


Marketing:

- destacados.
- promociones.
- publicidad.


Usuarios:

- empleados.
- permisos.

La solución debe permitir evolucionar desde:


Marketplace local provincial


hacia:


Marketplace nacional argentino


con soporte para:


- millones de publicaciones.
- miles de comercios.
- tiendas oficiales.
- publicidad.
- logística.
- pagos online.
- integraciones externas.