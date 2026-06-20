"use client";

import { useState, useEffect } from "react";

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "publish" | "inventory">("summary");
  
  // Mock states for demonstration
  const [sellerProfile, setSellerProfile] = useState({
    name: "Ferretería El Pampeano",
    type: "BUSINESS_SELLER",
    score: 95,
    tier: "GOLD",
    plan: "PRO_BUSINESS",
  });

  const [myListings, setMyListings] = useState<Listing[]>([
    {
      id: "l1",
      price: 125000.0,
      condition: "NEW",
      stock: 12,
      status: "APPROVED",
      product: {
        name: "Taladro Percutor Bosch 500W",
        brand: "Bosch",
        description: "Taladro percutor profesional en caja cerrada.",
      },
    },
    {
      id: "l2",
      price: 18500.0,
      condition: "NEW",
      stock: 45,
      status: "APPROVED",
      product: {
        name: "Miel Orgánica Pura del Caldenal",
        brand: "Pampeana Alta",
        description: "Frasco de 1kg cosechado artesanalmente.",
      },
    },
  ]);

  // Form states
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [stock, setStock] = useState("5");
  const [category, setCategory] = useState("tecnologia");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    // Simulate calling the API endpoints sequentially
    setTimeout(() => {
      const newListing: Listing = {
        id: "l-" + Math.random().toString(36).substr(2, 9),
        price: parseFloat(price) || 0,
        condition,
        stock: parseInt(stock) || 0,
        status: "APPROVED",
        product: {
          name: productName,
          brand,
          description,
        },
      };

      setMyListings([newListing, ...myListings]);
      setSuccessMsg("¡Publicación creada con éxito! Pasó la moderación automática y ya está activa en el catálogo.");
      setProductName("");
      setBrand("");
      setDescription("");
      setPrice("");
      setStock("5");
      setLoading(false);
    }, 1200);
  };

  const handleUpdateStock = (id: string, amount: number) => {
    setMyListings(myListings.map(l => {
      if (l.id === id) {
        const newStock = Math.max(0, l.stock + amount);
        return { ...l, stock: newStock };
      }
      return l;
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-card-border pb-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Panel de Vendedor</h1>
          <p className="text-text-muted text-sm mt-1">
            Gestioná tus publicaciones, controlá tu stock y consultá tus métricas comerciales.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 border border-card-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "summary" ? "bg-accent-gold text-background shadow-md" : "text-white hover:text-accent-gold"
            }`}
          >
            Resumen
          </button>
          <button 
            onClick={() => setActiveTab("publish")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "publish" ? "bg-accent-gold text-background shadow-md" : "text-white hover:text-accent-gold"
            }`}
          >
            Publicar Artículo
          </button>
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "inventory" ? "bg-accent-gold text-background shadow-md" : "text-white hover:text-accent-gold"
            }`}
          >
            Inventario ({myListings.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* TAB 1: Summary */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Seller profile card */}
            <div className="col-span-1 md:col-span-2 rounded-2xl glass-panel p-6 flex flex-col gap-4">
              <h3 className="font-heading text-sm font-extrabold text-white uppercase tracking-wider">Perfil Comercial</h3>
              <div>
                <h4 className="text-xl font-bold text-white">{sellerProfile.name}</h4>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-2.5 py-0.5 text-xs font-semibold text-accent-green border border-accent-green/20 mt-2">
                  💼 Cuenta: {sellerProfile.type === "BUSINESS_SELLER" ? "Comercio / Empresa" : "Particular"}
                </span>
              </div>
              <div className="border-t border-card-border/50 pt-4 flex justify-between text-xs text-text-muted">
                <span>Plan Actual: <strong className="text-white">{sellerProfile.plan}</strong></span>
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
              <span className="text-5xl font-extrabold text-white font-heading">{myListings.length}</span>
              <p className="text-[10px] text-text-muted mt-4">Límite disponible: {sellerProfile.type === "BUSINESS_SELLER" ? "Ilimitado" : `${5 - myListings.length} de 5 libres`}</p>
            </div>

          </div>
        )}

        {/* TAB 2: Publish Form */}
        {activeTab === "publish" && (
          <div className="max-w-3xl mx-auto w-full rounded-2xl glass-panel p-8">
            <h2 className="font-heading text-lg font-bold text-white mb-6">Formulario de Publicación Directa</h2>
            
            {successMsg && (
              <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 text-xs font-medium text-accent-green mb-6">
                {successMsg}
              </div>
            )}

            <form onSubmit={handlePublish} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">Nombre del Producto</label>
                  <input 
                    type="text" 
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ej. Taladro Bosch 500W" 
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">Marca</label>
                  <input 
                    type="text" 
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej. Bosch" 
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white">Descripción Técnica</label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalla las características del artículo..." 
                  className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">Precio ($ ARS)</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ej. 125000" 
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">Condición</label>
                  <select 
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold"
                  >
                    <option value="NEW">Nuevo</option>
                    <option value="USED">Usado</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">Stock Inicial</label>
                  <input 
                    type="number" 
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Ej. 5" 
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">Categoría</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-gold"
                  >
                    <option value="tecnologia">Tecnología</option>
                    <option value="hogar">Hogar</option>
                    <option value="vehiculos">Vehículos</option>
                    <option value="campo-agro">Campo / Agro</option>
                    <option value="construccion">Construcción</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover py-4 text-xs font-extrabold text-background shadow-md hover:opacity-95 transition-all mt-4 disabled:opacity-50"
              >
                {loading ? "Publicando en el Catálogo..." : "Confirmar Publicación"}
              </button>

            </form>
          </div>
        )}

        {/* TAB 3: Inventory List */}
        {activeTab === "inventory" && (
          <div className="w-full rounded-2xl glass-panel p-6 overflow-hidden">
            <h3 className="font-heading text-sm font-extrabold text-white uppercase tracking-wider mb-6">Listado de Artículos</h3>
            
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
                    <tr key={listing.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 pr-4 font-bold text-white">{listing.product.name}</td>
                      <td className="py-4 px-4 text-text-muted">{listing.product.brand}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          listing.condition === "NEW" ? "bg-accent-green/10 text-accent-green" : "bg-text-muted/10 text-text-muted"
                        }`}>
                          {listing.condition === "NEW" ? "NUEVO" : "USADO"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-white">
                        ${listing.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-white">{listing.stock}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-green/10 text-accent-green">
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <button 
                            onClick={() => handleUpdateStock(listing.id, -1)}
                            className="bg-slate-800 border border-card-border text-white h-7 w-7 rounded-lg font-bold hover:border-accent-gold transition-all"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => handleUpdateStock(listing.id, 1)}
                            className="bg-slate-800 border border-card-border text-white h-7 w-7 rounded-lg font-bold hover:border-accent-gold transition-all"
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
