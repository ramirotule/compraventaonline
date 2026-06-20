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

// Fallback mock listings (La Pampa themed & general)
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
    id: "l3",
    price: 85000.0,
    condition: "USED",
    featuredPlan: "FREE",
    product: {
      name: "Sillón Retro Tapizado Pana Verde",
      brand: "Vintage",
      description: "Sillón de un cuerpo estilo retro vintage años 70. Tapizado en pana verde musgo, patas de madera de caldén en excelente estado.",
      images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop"],
      category: { name: "Hogar" },
    },
    seller: {
      name: "Ramiro Tule (Particular)",
      score: 90,
      tier: "BRONCE",
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

async function getListings(): Promise<MockListing[]> {
  try {
    const res = await fetch("http://localhost:3001/api/listings?sort=relevance", {
      cache: "no-store",
    });
    if (!res.ok) return mockListings;
    const data = await res.json();
    return data.length > 0 ? data : mockListings;
  } catch (error) {
    // Si el backend no está iniciado, devolvemos mocks con gracia
    return mockListings;
  }
}

export default async function HomePage() {
  const listings = await getListings();

  // Categorías fijas con iconos descriptivos para renderizar rápido
  const categories = [
    { name: "Tecnología", slug: "tecnologia", icon: "💻", count: "124" },
    { name: "Hogar", slug: "hogar", icon: "🛋️", count: "89" },
    { name: "Vehículos", slug: "vehiculos", icon: "🚗", count: "210" },
    { name: "Campo / Agro", slug: "campo-agro", icon: "🌾", count: "450" },
    { name: "Construcción", slug: "construccion", icon: "🧱", count: "78" },
    { name: "Moda", slug: "moda", icon: "👕", count: "115" },
    { name: "Servicios", slug: "servicios", icon: "🔧", count: "64" },
    { name: "Coleccionables", slug: "coleccionables", icon: "🏺", count: "32" },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* 1. Hero Search Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/10 px-3 py-1 text-xs font-semibold text-accent-gold border border-accent-gold/20 mb-6 glow-gold">
            🌾 El Primer Marketplace 100% Pampeano
          </span>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground max-w-3xl mx-auto leading-[1.1]">
            Encontrá lo que buscas en <span className="bg-gradient-to-r from-accent-gold to-accent-green bg-clip-text text-transparent">La Pampa</span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-text-muted max-w-xl mx-auto">
            Comprá y vendé de forma segura y directa. Conectamos usuarios particulares y comercios de toda la provincia.
          </p>

          {/* Search Box Form */}
          <form action="/search" method="GET" className="mt-10 max-w-2xl mx-auto flex gap-2 p-2 rounded-2xl glass-panel glow-gold">
            <div className="flex-1 flex items-center gap-3 px-3">
              <span className="text-xl">🔍</span>
              <input 
                type="text" 
                name="q"
                placeholder="¿Qué estás buscando? (ej. taladro, miel, auto...)" 
                className="w-full bg-transparent border-none text-foreground placeholder-text-muted/70 focus:outline-none text-sm font-medium"
              />
            </div>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover px-6 py-3 text-xs font-extrabold text-background shadow-md hover:opacity-95 transition-all">
              Buscar Ofertas
            </button>
          </form>

        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between border-b border-card-border pb-5 mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Explorá por Categoría</h2>
            <p className="text-sm text-text-muted mt-1">Navegá las categorías más buscadas de la provincia.</p>
          </div>
          <Link href="/search" className="text-xs font-bold text-accent-gold hover:text-accent-gold-hover hover:underline transition-all">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/search?category=${cat.slug}`}
              className="flex flex-col items-center justify-center p-5 rounded-2xl glass-card text-center group"
            >
              <span className="text-3xl mb-3 transition-transform group-hover:scale-110">{cat.icon}</span>
              <span className="text-xs font-bold text-foreground group-hover:text-accent-gold transition-colors">{cat.name}</span>
              <span className="text-[10px] text-text-muted mt-1">{cat.count} publ.</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Highlighted Listings Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between border-b border-card-border pb-5 mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Publicaciones Destacadas</h2>
            <p className="text-sm text-text-muted mt-1">Ofertas destacadas con excelente reputación de vendedor.</p>
          </div>
          <Link href="/search" className="text-xs font-bold text-accent-gold hover:text-accent-gold-hover hover:underline transition-all">
            Ver todas las publicaciones →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link 
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group flex flex-col rounded-2xl glass-card overflow-hidden relative cursor-pointer"
            >
              {/* Badge Plan */}
              {listing.featuredPlan !== "FREE" && (
                <span className={`absolute top-3 left-3 z-10 rounded-lg px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-background shadow-md uppercase ${
                  listing.featuredPlan === "PREMIUM" ? "bg-accent-gold" : "bg-accent-blue"
                }`}>
                  {listing.featuredPlan === "PREMIUM" ? "💎 PREMIUM" : "⚡ DESTACADO"}
                </span>
              )}

              {/* Image Container */}
              <div className="h-48 w-full bg-slate-950 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={listing.product.images[0]} 
                  alt={listing.product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase">
                  <span>{listing.product.category.name}</span>
                  <span className={`px-1.5 py-0.5 rounded ${listing.condition === "NEW" ? "bg-accent-green/10 text-accent-green" : "bg-text-muted/10 text-text-muted"}`}>
                    {listing.condition === "NEW" ? "NUEVO" : "USADO"}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-accent-gold transition-colors line-clamp-1">
                  {listing.product.name}
                </h3>
                
                <p className="text-xs text-text-muted line-clamp-2 -mt-1 leading-relaxed">
                  {listing.product.description}
                </p>

                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-xs font-semibold text-accent-gold">$</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {listing.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Seller Bar */}
                <div className="border-t border-card-border/50 pt-3 mt-1 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-foreground leading-none">
                      {listing.seller.name}
                    </span>
                    <span className="text-[8px] text-text-muted mt-0.5 uppercase">
                      Reputación: {listing.seller.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-accent-gold font-bold">
                    <span>★</span>
                    <span className="text-[10px]">{listing.seller.score / 10}</span>
                  </div>
                </div>

              </div>

            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
