# Especificación Funcional: Contratos de API y Reglas de Negocio

Este documento detalla los contratos de API HTTP y las reglas de negocio críticas para compraventaonline.com.ar.

---

## 1. Reglas de Negocio Core

### RN-01: Registro y Aceptación de Términos (Onboarding)
- Ningún usuario puede publicar productos ni registrarse como vendedor (`Seller`) sin aceptar explícitamente la versión actual de los Términos y Condiciones.
- Se debe almacenar el timestamp exacto, la versión de los términos aceptados y el flag `accepted_terms = true`.

### RN-02: Publicaciones Gratuitas vs Comerciales
- **Particular (`PERSONAL_SELLER`)**: Límite de 5 publicaciones simultáneas activas. No tienen costo de comisión ni de publicación.
- **Comercio (`BUSINESS_SELLER`)**: Requiere suscripción activa (`FREE_BUSINESS`, `PRO_BUSINESS` o `ENTERPRISE`).
- Las publicaciones expiran automáticamente a los 30 días si no son renovadas por el vendedor.

### RN-03: Moderación Preventiva de Contenido
- Al crear o modificar una publicación, el título, descripción e imágenes pasan por un motor de moderación automática.
- Si el análisis detecta palabras o imágenes prohibidas (ej. armas, drogas), el estado se establece inmediatamente como `BLOCKED`.
- Si hay dudas de seguridad o fraude (por ejemplo, precios sospechosamente bajos), se establece como `REVIEW_REQUIRED` (oculto al público hasta que un moderador lo apruebe o rechace).

### RN-04: Cálculo Dinámico de Reputación
- La reputación se actualiza en segundo plano tras cada venta o calificación:
  - Venta exitosa: `+10` puntos.
  - Calificación positiva: `+5` puntos.
  - Calificación negativa: `-15` puntos.
  - Reporte confirmado de fraude: Penalización total (puntuación a `0` y suspensión temporal del perfil).

---

## 2. Contratos de API HTTP (REST)

### 2.1 Módulo Vendedores (`/api/sellers`)

#### Registrar Perfil de Vendedor
- **Endpoint**: `POST /api/sellers`
- **Autenticación**: Requerida (Bearer JWT)
- **Request Body**:
```json
{
  "type": "PERSONAL_SELLER", // o "BUSINESS_SELLER"
  "name": "Ferretería El Pampeano",
  "document_number": "30-12345678-9", // CUIT o DNI
  "accepted_terms": true,
  "terms_version": "v1.0"
}
```
- **Response (201 Created)**:
```json
{
  "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "user_id": "9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c",
  "type": "BUSINESS_SELLER",
  "name": "Ferretería El Pampeano",
  "score": 100,
  "tier": "BRONCE",
  "created_at": "2026-06-20T18:57:00Z"
}
```

#### Obtener Reputación de Vendedor (Público)
- **Endpoint**: `GET /api/sellers/:id/reputation`
- **Autenticación**: Ninguna
- **Response (200 OK)**:
```json
{
  "seller_id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "score": 95,
  "tier": "PREMIUM",
  "completed_sales": 48,
  "positive_ratings": 45,
  "negative_ratings": 3,
  "badges": ["VENDEDOR_VERIFICADO", "ENVIO_RAPIDO"]
}
```

---

### 2.2 Módulo Catálogo & Productos (`/api/products`)

#### Buscar Productos en Catálogo
- **Endpoint**: `GET /api/products`
- **Query Params**:
  - `q`: string (búsqueda de texto)
  - `category_id`: uuid (filtrar por categoría)
  - `page`: número (default 1)
  - `limit`: número (default 20)
- **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
      "name": "Taladro Percutor Bosch 500W",
      "brand": "Bosch",
      "category_id": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
      "images": ["https://cdn.compraventaonline.com/products/taladro_bosch_1.jpg"]
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "pages": 6
  }
}
```

---

### 2.3 Módulo Publicaciones (`/api/listings`)

#### Crear Publicación
- **Endpoint**: `POST /api/listings`
- **Autenticación**: Requerida (Bearer JWT)
- **Request Body**:
```json
{
  "product_id": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e", // ID del producto global en catálogo
  "price": 115000.00,
  "condition": "NEW", // NEW | USED
  "stock": 10,
  "images": [
    "https://cdn.compraventaonline.com/listings/seller_123/taladro_caja.jpg"
  ]
}
```
- **Response (210 Created / 200 OK)**:
```json
{
  "id": "4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
  "product_id": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
  "seller_id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "price": 115000.00,
  "condition": "NEW",
  "stock": 10,
  "status": "APPROVED", // APPROVED | REVIEW_REQUIRED | BLOCKED
  "featured_plan": "FREE",
  "created_at": "2026-06-20T18:57:10Z"
}
```

#### Buscar Publicaciones Activas
- **Endpoint**: `GET /api/listings`
- **Query Params**:
  - `product_id`: uuid (para ver ofertas de un mismo producto)
  - `min_price`: decimal
  - `max_price`: decimal
  - `condition`: `NEW` | `USED`
  - `province`: string (ej: "La Pampa")
  - `sort`: `price_asc` | `price_desc` | `relevance`
- **Response (200 OK)**:
```json
{
  "listings": [
    {
      "id": "4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
      "price": 115000.00,
      "condition": "NEW",
      "stock": 10,
      "featured_plan": "PREMIUM",
      "seller": {
        "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Ferretería El Pampeano",
        "score": 98,
        "tier": "GOLD"
      }
    }
  ]
}
```

---

### 2.4 Módulo Reportes y Denuncias (`/api/reports`)

#### Denunciar una Publicación
- **Endpoint**: `POST /api/reports`
- **Autenticación**: Requerida (Bearer JWT)
- **Request Body**:
```json
{
  "listing_id": "4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
  "reason": "FRAUD", // FRAUD | ILLEGAL_PRODUCT | OFFENSIVE | OTHER
  "description": "El vendedor me pide transferencia externa para reservar el producto y no responde."
}
```
- **Response (201 Created)**:
```json
{
  "id": "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
  "listing_id": "4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
  "reason": "FRAUD",
  "status": "PENDING",
  "created_at": "2026-06-20T18:57:20Z"
}
```

---

## Próximo Paso
El siguiente documento es la fase de Diseño (`openspec/03-design.md`) donde se modelará el esquema físico de la base de datos (PostgreSQL) y la estructura de componentes e inyección de NestJS.
