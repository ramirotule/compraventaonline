"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MockListing {
  id: string;
  price: number;
  condition: string;
  featuredPlan: string;
  product: {
    name: string;
    brand: string;
    description: string;
    images: string[];
    category: { name: string };
  };
  seller: {
    name: string;
    score: number;
    tier: string;
  };
}

const mockListings: MockListing[] = [
  {
    id: "l1",
    price: 18500.0,
    condition: "NEW",
    featuredPlan: "PREMIUM",
    product: {
      name: "Miel Orgánica Pura del Caldenal",
      brand: "Pampeana Alta",
      description: "Miel pura de abeja de flores silvestres cosechada en el caldenal pampeano. 100% natural, frasco de 1kg.",
      images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop"],
      category: { name: "Campo / Agro" },
    },
    seller: {
      name: "Apicultura La Fusta",
      score: 98,
      tier: "PREMIUM",
    },
  },
  {
    id: "l2",
    price: 125000.0,
    condition: "NEW",
    featuredPlan: "FEATURED",
    product: {
      name: "Taladro Percutor Bosch 500W",
      brand: "Bosch",
      description: "Taladro percutor Bosch GSB 13 RE Professional. Potente motor de 500 W, ideal para mampostería, madera y metal.",
      images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop"],
      category: { name: "Construcción" },
    },
    seller: {
      name: "Ferretería El Pampeano",
      score: 95,
      tier: "GOLD",
    },
  },
  {
    id: "l4",
    price: 11000.0,
    condition: "NEW",
    featuredPlan: "PREMIUM",
    product: {
      name: "Queso de Campo Saborizado con Hierbas",
      brand: "Estancia El Caldén",
      description: "Queso artesanal semi-duro saborizado con orégano y provenzal. Horma de 800g directamente de tambo pampeano.",
      images: ["https://images.unsplash.com/photo-1486299267070-8382e214434b?q=80&w=600&auto=format&fit=crop"],
      category: { name: "Campo / Agro" },
    },
    seller: {
      name: "Distribuidora Luro",
      score: 99,
      tier: "PREMIUM",
    },
  },
];

// Función para barajar elementos usando el algoritmo Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DestacadosPage() {
  const [listings, setListings] = useState<MockListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/listings", {
          cache: "no-store",
        });
        const data = await res.json() as MockListing[];
        
        const sourceData: MockListing[] = (data && data.length > 0) ? data : mockListings;
        
        // 1. Filtrar solo los anuncios que son PREMIUM o FEATURED (destacados de pago o premios)
        const featuredListings = sourceData.filter(
          (item) => item.featuredPlan === "PREMIUM" || item.featuredPlan === "FEATURED"
        );
        
        // 2. Agrupar por plan para respetar jerarquía de categoría pagada
        const premiums = featuredListings.filter((item) => item.featuredPlan === "PREMIUM");
        const featureds = featuredListings.filter((item) => item.featuredPlan === "FEATURED");
        
        // 3. Barajar aleatoriamente dentro de cada grupo para garantizar IGUALDAD de condiciones
        const shuffledPremiums = shuffleArray(premiums);
        const shuffledFeatureds = shuffleArray(featureds);
        
        // 4. Concatenar respetando el orden de prioridad (Premium primero, luego Featured)
        setListings([...shuffledPremiums, ...shuffledFeatureds]);
      } catch (error) {
        // Fallback en caso de error de conexión
        const premiums = mockListings.filter((item) => item.featuredPlan === "PREMIUM");
        const featureds = mockListings.filter((item) => item.featuredPlan === "FEATURED");
        setListings([...shuffleArray(premiums), ...shuffleArray(featureds)]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col gap-10">
      
      {/* Title Header */}
      <div className="border-b border-card-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">⭐</span>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            Publicaciones Destacadas
          </h1>
        </div>
        <p className="text-text-muted text-xs mt-2 leading-relaxed max-w-2xl">
          Descubrí los mejores productos y ofertas destacadas por los comercios y vendedores de La Pampa.
        </p>
      </div>

      {/* Criterio de Rotación Informativo */}
      <div className="rounded-2xl border border-accent-gold/20 bg-accent-gold/5 p-4 flex gap-3 items-start text-xs text-text-muted leading-relaxed">
        <span className="text-accent-gold text-lg select-none">🔄</span>
        <div>
          <p className="font-bold text-foreground mb-1">Rotación Equitativa para Vendedores</p>
          Para asegurar que todos nuestros clientes y anunciantes tengan las mismas oportunidades, las publicaciones dentro de un mismo plan destacado se ordenan de manera **completamente aleatoria** cada vez que se ingresa a la página. Esto garantiza que todos los productos se visualicen por igual sin importar la fecha de contratación del servicio.
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-xs text-text-muted">
          <svg className="animate-spin h-8 w-8 text-accent-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Cargando publicaciones destacadas...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-card-border rounded-3xl flex flex-col items-center gap-2">
          <span className="text-4xl">📭</span>
          <h3 className="font-heading text-sm font-bold text-foreground mt-2">No hay publicaciones destacadas activas</h3>
          <p className="text-text-muted text-xs">
            ¡Sé el primero en destacar un producto desde tu panel de vendedor!
          </p>
          <Link 
            href="/dashboard?tab=publish" 
            className="mt-4 rounded-xl bg-accent-gold px-5 py-2.5 text-xs font-extrabold text-background shadow-md hover:opacity-90 transition-all"
          >
            Destacar Artículo
          </Link>
        </div>
      ) : (
        /* Listings Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const isPremium = item.featuredPlan === "PREMIUM";
            return (
              <Link 
                href={`/listings/${item.id}`}
                key={item.id}
                className={`relative rounded-3xl border bg-card-bg-solid overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  isPremium 
                    ? "border-accent-gold/40 shadow-[0_0_15px_rgba(217,119,6,0.06)] hover:border-accent-gold" 
                    : "border-card-border hover:border-accent-green/50"
                }`}
              >
                {/* Visual Image Container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-card-border/30 relative">
                  <img 
                    src={item.product.images[0] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"} 
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-[9px] font-bold text-foreground px-2.5 py-1 rounded-full uppercase tracking-wider border border-card-border/30 shadow-sm">
                    {item.product.category?.name || "Clasificado"}
                  </span>

                  {/* Plan Badge */}
                  <span className={`absolute top-4 right-4 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border shadow-md flex items-center gap-1 ${
                    isPremium 
                      ? "bg-accent-gold text-background border-accent-gold animate-pulse" 
                      : "bg-accent-green text-background border-accent-green"
                  }`}>
                    {isPremium ? "👑 Premium" : "⭐ Destacado"}
                  </span>
                </div>

                {/* Listing Details */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-accent-gold transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-text-muted text-[11px] line-clamp-3 leading-relaxed">
                      {item.product.description}
                    </p>
                  </div>

                  {/* Seller & Reputation details */}
                  <div className="flex items-center justify-between border-t border-card-border/30 pt-3 text-[10px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-muted">Vendedor</span>
                      <span className="font-bold text-foreground max-w-[150px] truncate">
                        {item.seller.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-text-muted">Reputación</span>
                      <span className="font-extrabold text-accent-green">
                        {item.seller.score}/100
                      </span>
                    </div>
                  </div>

                  {/* Bottom CTA & Price */}
                  <div className="flex items-center justify-between border-t border-card-border/30 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase font-semibold">Precio</span>
                      <span className="font-heading text-lg font-extrabold text-foreground">
                        ${item.price.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <span 
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isPremium 
                          ? "bg-gradient-to-r from-accent-gold to-accent-gold-hover text-background shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-card-bg border border-card-border text-foreground hover:text-accent-gold hover:border-accent-gold/40"
                      }`}
                    >
                      Ver Detalle
                    </span>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
