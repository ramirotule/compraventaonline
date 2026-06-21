"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SellerProfile {
  name: string;
}

export default function HeaderSessionBar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  // Carrito de compras local simulado
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Miel de Caldén Orgánica", price: 15000, quantity: 1 },
    { id: "2", name: "Salame Casero de Campo", price: 8500, quantity: 2 },
  ]);

  // Dropdown de perfil
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleAuthChange = () => {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);

      if (savedToken) {
        fetch("http://localhost:3001/api/sellers/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Invalid session");
          })
          .then((data) => setProfile(data))
          .catch(() => {
            localStorage.removeItem("token");
            setToken(null);
            setProfile(null);
          });
      } else {
        setToken(null);
        setProfile(null);
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    handleAuthChange();

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    setShowCart(false);
    setShowUserMenu(false);
    router.push("/");
    router.refresh();
  };

  const handleEmptyCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) {
    // SSR Placeholder to avoid layout shifts
    return (
      <div className="flex items-center gap-4">
        <div className="h-[38px] w-[90px] rounded-xl bg-card-bg border border-card-border opacity-50 hidden sm:block" />
        <div className="h-[38px] w-[80px] rounded-xl bg-card-bg border border-card-border opacity-50" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Mobile search indicator */}
      <Link href="/search" className="p-2 text-text-muted hover:text-foreground transition-colors md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </Link>

      {/* CTA Vender */}
      <Link
        href="/dashboard?tab=publish"
        className="sell-cta-pulse hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover px-5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-background border border-accent-gold/50 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        Vender
      </Link>

      {token ? (
        <div className="flex items-center gap-4 relative">

          {/* User Profile Indicator / Dropdown Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowCart(false);
              }}
              className="flex items-center gap-2 bg-card-bg border border-card-border/50 pl-1.5 pr-3 py-1 rounded-full shadow-sm hover:border-card-border transition-colors cursor-pointer select-none"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-accent-gold to-accent-gold-hover text-background font-bold text-xs uppercase shadow-sm">
                {profile ? profile.name.charAt(0) : "U"}
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-foreground max-w-[130px] truncate">
                {profile ? `Bienvenido, ${profile.name}` : "Cargando..."}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* Dropdown de Usuario */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-card-bg-solid border border-card-border p-2.5 shadow-2xl z-50 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1 border-b border-card-border/30 mb-1">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Mi Cuenta</p>
                  </div>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground/80 hover:text-accent-gold hover:bg-card-border/30 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold">
                      <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                      <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                      <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                      <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                    </svg>
                    Mi Panel / Perfil
                  </Link>
                  <button 
                    onClick={() => { setShowUserMenu(false); alert("Próximamente: Tus Compras en CompraVentaOnline La Pampa"); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground/80 hover:text-accent-gold hover:bg-card-border/30 transition-all w-full text-left cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                      <path d="M6 2 2 6v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6l-4-4z"></path>
                      <line x1="2" y1="6" x2="22" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Mis Compras
                  </button>
                  <button 
                    onClick={() => { setShowUserMenu(false); alert("Próximamente: Tus Favoritos de La Pampa"); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground/80 hover:text-accent-gold hover:bg-card-border/30 transition-all w-full text-left cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Mis Favoritos
                  </button>
                  <div className="border-t border-card-border/30 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Carrito de Compras */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowCart(!showCart);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-text-muted hover:text-foreground transition-colors hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center rounded-xl bg-card-bg border border-card-border/80 hover:border-card-border h-9 w-9 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center h-5 w-5 text-[9px] font-extrabold leading-none text-background bg-accent-gold rounded-full border border-background shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Dropdown del Carrito */}
            {showCart && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCart(false)} />
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-card-bg-solid border border-card-border p-4 shadow-2xl z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-card-border/50 pb-2">
                    <h4 className="font-heading text-xs font-extrabold text-foreground uppercase tracking-wider">Mi Carrito</h4>
                    <span className="text-[10px] font-bold text-text-muted">{totalItems} artículos</span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-text-muted">
                      Tu carrito está vacío.
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-start gap-2 text-xs">
                            <div className="flex-1">
                              <p className="font-bold text-foreground">{item.name}</p>
                              <p className="text-[10px] text-text-muted text-left">Cant: {item.quantity}</p>
                            </div>
                            <span className="font-extrabold text-foreground whitespace-nowrap">
                              ${(item.price * item.quantity).toLocaleString("es-AR")}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-card-border/50 pt-2 flex justify-between items-center text-xs">
                        <span className="text-text-muted">Total:</span>
                        <span className="font-extrabold text-accent-gold text-sm">
                          ${totalPrice.toLocaleString("es-AR")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button 
                          onClick={handleEmptyCart}
                          className="py-2 text-[10px] font-bold rounded-lg border border-red-500/20 hover:border-red-500 text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                        >
                          Vaciar
                        </button>
                        <button 
                          onClick={() => alert("¡Iniciando la compra en CompraVentaOnline La Pampa!")}
                          className="py-2 text-[10px] font-extrabold rounded-lg bg-gradient-to-r from-accent-gold to-accent-gold-hover text-background shadow-md hover:opacity-95 transition-all cursor-pointer"
                        >
                          Comprar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      ) : (
        /* Login CTA Button */
        <Link href="/login" className="rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover px-5 py-2 text-xs font-extrabold text-background shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all">
          Ingresar
        </Link>
      )}
    </div>
  );
}
