"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Listing {
  id: string;
  price: number;
  condition: string;
  stock: number;
  status: string;
  product: {
    name: string;
    brand: string;
    description: string;
  };
}

interface SellerProfile {
  id: string;
  name: string;
  type: string;
  score: number;
  tier: string;
  plan: string;
}

interface BackendCategory {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Domain states
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "publish" | "inventory">("summary");
  
  // Form states
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [stock, setStock] = useState("5");
  const [categoryId, setCategoryId] = useState("");
  const [featuredPlan, setFeaturedPlan] = useState("FREE");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Check auth and mount
  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
    } else {
      setToken(savedToken);
    }
  }, [router]);

  // Load profile and categories once token is available
  useEffect(() => {
    if (!token) return;

    async function loadDashboardData() {
      try {
        // 1. Fetch Profile
        const profileRes = await fetch("http://localhost:3001/api/sellers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!profileRes.ok) {
          if (profileRes.status === 401 || profileRes.status === 403) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error("No pudimos encontrar tu perfil de vendedor.");
        }
        
        const profileData = await profileRes.json();
        setSellerProfile(profileData);

        // 2. Fetch Categories
        const catRes = await fetch("http://localhost:3001/api/products/categories");
        if (catRes.ok) {
          const catData = await catRes.json();
          // Mapeamos tanto raíces como subcategorías en una sola lista plana para facilitar la selección
          const flatCategories: BackendCategory[] = [];
          catData.forEach((cat: any) => {
            flatCategories.push({ id: cat.id, name: cat.name, slug: cat.slug });
            if (cat.subCategories && cat.subCategories.length > 0) {
              cat.subCategories.forEach((sub: any) => {
                flatCategories.push({ id: sub.id, name: `↳ ${sub.name}`, slug: sub.slug });
              });
            }
          });
          setCategories(flatCategories);
          if (flatCategories.length > 0) {
            setCategoryId(flatCategories[0].id);
          }
        }

        // 3. Fetch Seller Listings
        const listingsRes = await fetch(`http://localhost:3001/api/listings?seller_id=${profileData.id}`);
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          setMyListings(listingsData);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Error al cargar los datos del panel.");
      } finally {
        setPageLoading(false);
      }
    }

    loadDashboardData();
  }, [token, router]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Step 1: Create Global Product
      const productRes = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productName,
          description,
          brand,
          categoryId,
          images: ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"],
        }),
      });

      const productData = await productRes.json();
      if (!productRes.ok) {
        throw new Error(productData.message || "Error al registrar el producto en el catálogo.");
      }

      // Step 2: Create Listing for the Product
      const listingRes = await fetch("http://localhost:3001/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productData.id,
          price: parseFloat(price),
          condition,
          stock: parseInt(stock),
          featuredPlan,
          images: ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"],
        }),
      });

      const listingData = await listingRes.json();
      if (!listingRes.ok) {
        throw new Error(listingData.message || "Error al crear la publicación.");
      }

      // Update local state
      setMyListings([listingData, ...myListings]);
      setSuccessMsg("¡Publicación creada con éxito! Pasó la moderación de contenido y ya se encuentra activa.");
      
      // Reset form
      setProductName("");
      setBrand("");
      setDescription("");
      setPrice("");
      setStock("5");
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error al procesar tu publicación.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id: string, amount: number) => {
    const listing = myListings.find(l => l.id === id);
    if (!listing) return;

    const newStock = Math.max(0, listing.stock + amount);

    try {
      const res = await fetch(`http://localhost:3001/api/listings/${id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "No se pudo actualizar el stock.");
      }

      // Sync local listings state
      setMyListings(myListings.map(l => (l.id === id ? { ...l, stock: newStock } : l)));
    } catch (err: any) {
      alert(err.message || "Error al actualizar stock.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
    router.refresh();
  };

  if (!mounted || pageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-gold border-t-transparent"></div>
          <span className="text-sm font-semibold text-text-muted">Cargando panel de control pampeano...</span>
        </div>
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-5xl">🌾</span>
        <h2 className="font-heading text-2xl font-bold text-foreground mt-4">Perfil no encontrado</h2>
        <p className="text-text-muted text-sm mt-2">No pudimos vincular un perfil comercial con esta cuenta de usuario.</p>
        <button 
          onClick={handleLogout} 
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover px-6 py-3 text-xs font-bold text-background shadow-md cursor-pointer"
        >
          Volver a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-card-border pb-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">Panel de Vendedor</h1>
          <p className="text-text-muted text-sm mt-1">
            Gestioná tus publicaciones, controlá tu stock y consultá tus métricas comerciales.
          </p>
        </div>
        
        {/* Navigation Tabs and Logout */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-card-bg border border-card-border p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "summary" ? "bg-accent-gold text-background shadow-md" : "text-foreground/80 hover:text-accent-gold"
              }`}
            >
              Resumen
            </button>
            <button 
              onClick={() => setActiveTab("publish")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "publish" ? "bg-accent-gold text-background shadow-md" : "text-foreground/80 hover:text-accent-gold"
              }`}
            >
              Publicar Artículo
            </button>
            <button 
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "inventory" ? "bg-accent-gold text-background shadow-md" : "text-foreground/80 hover:text-accent-gold"
              }`}
            >
              Inventario ({myListings.length})
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="rounded-xl border border-red-500/20 hover:border-red-500 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-xs font-semibold mb-6">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        
        {/* TAB 1: Summary */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Seller profile card */}
            <div className="col-span-1 md:col-span-2 rounded-2xl glass-panel p-6 flex flex-col gap-4">
              <h3 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">Perfil Comercial</h3>
              <div>
                <h4 className="text-xl font-bold text-foreground">{sellerProfile.name}</h4>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-2.5 py-0.5 text-xs font-semibold text-accent-green border border-accent-green/20 mt-2">
                  💼 Cuenta: {sellerProfile.type === "BUSINESS_SELLER" ? "Comercio / Empresa" : "Particular"}
                </span>
              </div>
              <div className="border-t border-card-border/50 pt-4 flex justify-between text-xs text-text-muted">
                <span>Plan Actual: <strong className="text-foreground">{sellerProfile.plan}</strong></span>
                <span>Tier de Venta: <strong className="text-accent-gold">{sellerProfile.tier}</strong></span>
              </div>
            </div>

            {/* Reputacion score */}
            <div className="rounded-2xl glass-panel p-6 flex flex-col items-center justify-center text-center">
              <h3 className="font-heading text-xs font-extrabold text-text-muted uppercase tracking-wider mb-2">Score del Vendedor</h3>
              <div className="relative flex items-center justify-center">
                <span className="text-5xl font-extrabold text-accent-gold font-heading">{sellerProfile.score}</span>
                <span className="text-lg text-text-muted mt-4">/100</span>
              </div>
              <p className="text-[10px] text-text-muted mt-3">Reputación excelente basada en tus últimas calificaciones pampeanas.</p>
            </div>

            {/* Active listings summary */}
            <div className="rounded-2xl glass-panel p-6 flex flex-col items-center justify-center text-center">
              <h3 className="font-heading text-xs font-extrabold text-text-muted uppercase tracking-wider mb-2">Publicaciones Activas</h3>
              <span className="text-5xl font-extrabold text-foreground font-heading">{myListings.length}</span>
              <p className="text-[10px] text-text-muted mt-4">Límite disponible: {sellerProfile.type === "BUSINESS_SELLER" ? "Ilimitado" : `${5 - myListings.length} de 5 libres`}</p>
            </div>

          </div>
        )}

        {/* TAB 2: Publish Form */}
        {activeTab === "publish" && (
          <div className="max-w-3xl mx-auto w-full rounded-2xl glass-panel p-8">
            <h2 className="font-heading text-lg font-bold text-foreground mb-6">Formulario de Publicación Directa</h2>
            
            {successMsg && (
              <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 text-xs font-medium text-accent-green mb-6">
                {successMsg}
              </div>
            )}

            <form onSubmit={handlePublish} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">Nombre del Producto</label>
                  <input 
                    type="text" 
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ej. Miel de Caldén o Amoladora Industrial" 
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">Marca</label>
                  <input 
                    type="text" 
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej. Estancia La Pampa" 
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground">Descripción Técnica</label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalla las características del artículo..." 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">Precio ($ ARS)</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ej. 125000" 
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">Condición</label>
                  <select 
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                  >
                    <option value="NEW">Nuevo</option>
                    <option value="USED">Usado</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">Stock Inicial</label>
                  <input 
                    type="number" 
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Ej. 5" 
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">Categoría</label>
                  <select 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground">Plan de Destacado (Monetización)</label>
                <select 
                  value={featuredPlan}
                  onChange={(e) => setFeaturedPlan(e.target.value)}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                >
                  <option value="FREE">Plan Gratuito (FREE)</option>
                  <option value="FEATURED">Plan Destacado (FEATURED)</option>
                  <option value="PREMIUM">Plan Premium (PREMIUM)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover py-4 text-xs font-extrabold text-background shadow-md hover:opacity-95 transition-all mt-4 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Publicando en el Catálogo..." : "Confirmar Publicación"}
              </button>

            </form>
          </div>
        )}

        {/* TAB 3: Inventory List */}
        {activeTab === "inventory" && (
          <div className="w-full rounded-2xl glass-panel p-6 overflow-hidden">
            <h3 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider mb-6">Listado de Artículos</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-card-border text-text-muted font-bold">
                    <th className="pb-3 pr-4">Artículo</th>
                    <th className="pb-3 px-4">Marca</th>
                    <th className="pb-3 px-4 text-center">Condición</th>
                    <th className="pb-3 px-4 text-right">Precio</th>
                    <th className="pb-3 px-4 text-center">Stock</th>
                    <th className="pb-3 px-4 text-center">Estado</th>
                    <th className="pb-3 pl-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/30">
                  {myListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-card-bg/30 transition-colors">
                      <td className="py-4 pr-4 font-bold text-foreground">
                        <Link href={`/listings/${listing.id}`} className="hover:text-accent-gold transition-colors">
                          {listing.product.name}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-text-muted">{listing.product.brand}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          listing.condition === "NEW" ? "bg-accent-green/10 text-accent-green" : "bg-text-muted/10 text-text-muted"
                        }`}>
                          {listing.condition === "NEW" ? "NUEVO" : "USADO"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-foreground">
                        ${listing.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-foreground">{listing.stock}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          listing.status === "APPROVED" ? "bg-accent-green/10 text-accent-green" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {listing.status === "APPROVED" ? "APROBADO" : "EN REVISIÓN"}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <button 
                            onClick={() => handleUpdateStock(listing.id, -1)}
                            className="bg-card-bg border border-card-border text-foreground h-7 w-7 rounded-lg font-bold hover:border-accent-gold transition-all flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => handleUpdateStock(listing.id, 1)}
                            className="bg-card-bg border border-card-border text-foreground h-7 w-7 rounded-lg font-bold hover:border-accent-gold transition-all flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
