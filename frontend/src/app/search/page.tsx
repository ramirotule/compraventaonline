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
    category: { slug: string; name: string };
  };
  seller: {
    name: string;
    score: number;
    tier: string;
  };
}

// Fallback search mock listings
const mockSearchListings: MockListing[] = [
  {
    id: "l1",
    price: 18500.0,
    condition: "NEW",
    featuredPlan: "PREMIUM",
    product: {
      name: "Miel Orgánica Pura del Caldenal",
      brand: "Pampeana Alta",
      description: "Miel pura de abeja de flores silvestres cosechada en el caldenal pampeano.",
      images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop"],
      category: { slug: "campo-agro", name: "Campo / Agro" },
    },
    seller: { name: "Apicultura La Fusta", score: 98, tier: "PREMIUM" },
  },
  {
    id: "l2",
    price: 125000.0,
    condition: "NEW",
    featuredPlan: "FEATURED",
    product: {
      name: "Taladro Percutor Bosch 500W",
      brand: "Bosch",
      description: "Taladro percutor Bosch GSB 13 RE Professional. Potente motor de 500 W.",
      images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop"],
      category: { slug: "construccion", name: "Construcción" },
    },
    seller: { name: "Ferretería El Pampeano", score: 95, tier: "GOLD" },
  },
  {
    id: "l3",
    price: 85000.0,
    condition: "USED",
    featuredPlan: "FREE",
    product: {
      name: "Sillón Retro Tapizado Pana Verde",
      brand: "Vintage",
      description: "Sillón de un cuerpo estilo retro vintage años 70. Tapizado en pana verde musgo.",
      images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop"],
      category: { slug: "hogar", name: "Hogar" },
    },
    seller: { name: "Ramiro Tule (Particular)", score: 90, tier: "BRONCE" },
  },
  {
    id: "l4",
    price: 11000.0,
    condition: "NEW",
    featuredPlan: "PREMIUM",
    product: {
      name: "Queso de Campo Saborizado con Hierbas",
      brand: "Estancia El Caldén",
      description: "Queso artesanal semi-duro saborizado con orégano y provenzal.",
      images: ["https://images.unsplash.com/photo-1486299267070-8382e214434b?q=80&w=600&auto=format&fit=crop"],
      category: { slug: "campo-agro", name: "Campo / Agro" },
    },
    seller: { name: "Distribuidora Luro", score: 99, tier: "PREMIUM" },
  },
  {
    id: "l5",
    price: 980000.0,
    condition: "USED",
    featuredPlan: "FREE",
    product: {
      name: "Honda Wave 110S Blanca",
      brand: "Honda",
      description: "Excelente estado, único dueño, 5000 km, papeles listos para transferir.",
      images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop"],
      category: { slug: "vehiculos", name: "Vehículos" },
    },
    seller: { name: "Moto Centro Pico", score: 92, tier: "PLATA" },
  },
];

async function searchListings(params: {
  q?: string;
  category?: string;
  condition?: string;
  sort?: string;
}): Promise<MockListing[]> {
  try {
    const urlParams = new URLSearchParams();
    if (params.q) urlParams.append("q", params.q);
    if (params.condition) urlParams.append("condition", params.condition);
    if (params.sort) urlParams.append("sort", params.sort);

    const res = await fetch(`http://localhost:3001/api/listings?${urlParams.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return mockSearchListings;
    const data = await res.json();
    let results: MockListing[] = data.length > 0 ? data : mockSearchListings;

    // Filtrar localmente si el backend falla o usamos mock
    if (params.q) {
      results = results.filter(l => 
        l.product.name.toLowerCase().includes(params.q!.toLowerCase()) ||
        l.product.brand.toLowerCase().includes(params.q!.toLowerCase())
      );
    }
    if (params.category) {
      results = results.filter(l => l.product.category.slug === params.category);
    }
    if (params.condition) {
      results = results.filter(l => l.condition === params.condition);
    }

    return results;
  } catch (error) {
    let results = [...mockSearchListings];
    if (params.q) {
      results = results.filter(l => 
        l.product.name.toLowerCase().includes(params.q!.toLowerCase()) ||
        l.product.brand.toLowerCase().includes(params.q!.toLowerCase())
      );
    }
    if (params.category) {
      results = results.filter(l => l.product.category.slug === params.category);
    }
    if (params.condition) {
      results = results.filter(l => l.condition === params.condition);
    }
    return results;
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; condition?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const listings = await searchListings(params);

  const categories = [
    { name: "Todas las categorías", slug: "" },
    { name: "Tecnología", slug: "tecnologia" },
    { name: "Hogar", slug: "hogar" },
    { name: "Vehículos", slug: "vehiculos" },
    { name: "Campo / Agro", slug: "campo-agro" },
    { name: "Construcción", slug: "construccion" },
    { name: "Moda", slug: "moda" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
      <h1 className="font-heading text-3xl font-extrabold text-white mb-2">Buscador de Publicaciones</h1>
      <p className="text-text-muted text-sm mb-8">Filtrá entre miles de ofertas directas locales.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Form Panel */}
        <aside className="w-full lg:w-64 shrink-0">
          <form action="/search" method="GET" className="flex flex-col gap-6 p-6 rounded-2xl glass-panel">
            <h3 className="font-heading text-sm font-extrabold text-white uppercase tracking-wider border-b border-card-border pb-3">Filtros</h3>
            
            {/* Input Search */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">Palabra Clave</label>
              <input 
                type="text" 
                name="q" 
                defaultValue={params.q || ""}
                placeholder="Ej. taladro..." 
                className="w-full bg-slate-900 border border-card-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">Categoría</label>
              <select 
                name="category" 
                defaultValue={params.category || ""}
                className="w-full bg-slate-900 border border-card-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-gold"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Condition Choice */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">Condición</label>
              <select 
                name="condition" 
                defaultValue={params.condition || ""}
                className="w-full bg-slate-900 border border-card-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-gold"
              >
                <option value="">Cualquier estado</option>
                <option value="NEW">Nuevo</option>
                <option value="USED">Usado</option>
              </select>
            </div>

            {/* Sort Choice */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">Ordenar Por</label>
              <select 
                name="sort" 
                defaultValue={params.sort || ""}
                className="w-full bg-slate-900 border border-card-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-gold"
              >
                <option value="">Relevancia</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover py-3 text-xs font-extrabold text-background shadow-md hover:opacity-95 transition-all mt-2">
              Aplicar Filtros
            </button>
          </form>
        </aside>

        {/* Search Results Grid */}
        <section className="flex-1">
          <div className="flex items-center justify-between border-b border-card-border pb-4 mb-6">
            <span className="text-xs font-bold text-text-muted">
              Se encontraron <span className="text-white">{listings.length}</span> publicaciones
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass-panel">
              <span className="text-4xl">🔍</span>
              <h3 className="font-heading text-lg font-bold text-white mt-4">Sin resultados</h3>
              <p className="text-text-muted text-xs mt-1">Prueba quitando algunos filtros o cambiando la búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="group flex flex-col rounded-2xl glass-card overflow-hidden relative">
                  {listing.featuredPlan !== "FREE" && (
                    <span className="absolute top-3 left-3 z-10 rounded-lg bg-accent-gold px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-background shadow-md uppercase">
                      💎 PREMIUM
                    </span>
                  )}
                  <div className="h-44 w-full bg-slate-950 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={listing.product.images[0]} 
                      alt={listing.product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase">
                      <span>{listing.product.category.name}</span>
                      <span className={`px-1.5 py-0.5 rounded ${listing.condition === "NEW" ? "bg-accent-green/10 text-accent-green" : "bg-text-muted/10 text-text-muted"}`}>
                        {listing.condition === "NEW" ? "NUEVO" : "USADO"}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-sm text-white group-hover:text-accent-gold transition-colors line-clamp-1">
                      {listing.product.name}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2 -mt-1 leading-relaxed">
                      {listing.product.description}
                    </p>

                    <div className="flex items-baseline gap-1 mt-auto">
                      <span className="text-xs font-semibold text-accent-gold">$</span>
                      <span className="text-lg font-extrabold text-white">
                        {listing.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="border-t border-card-border/50 pt-3 mt-1 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white leading-none">{listing.seller.name}</span>
                        <span className="text-[8px] text-text-muted mt-0.5 uppercase">Reputación: {listing.seller.tier}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs text-accent-gold font-bold">
                        <span>★</span>
                        <span className="text-[10px]">{listing.seller.score / 10}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
