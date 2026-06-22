"use client";

import { useEffect, useState, useRef } from "react";
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
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);

  // Dropdown de perfil
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Notificaciones de preguntas recibidas
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Refs para detectar clics fuera
  const cartRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Effect para cerrar menús al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {}
    } else {
      const defaultCart = [
        { id: "l1", name: "Miel de Caldén Orgánica", price: 15000, quantity: 1 },
        { id: "l2", name: "Salame Casero de Campo", price: 8500, quantity: 2 },
      ];
      localStorage.setItem("cart", JSON.stringify(defaultCart));
      setCartItems(defaultCart);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadCart();

    window.addEventListener("cart-change", loadCart);

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
      window.removeEventListener("cart-change", loadCart);
    };
  }, []);

  // Cargar notificaciones cuando se abre el panel
  useEffect(() => {
    if (showNotifications && token) {
      fetch("http://localhost:3001/api/questions/received", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data);
        })
        .catch(console.error);

      fetch("http://localhost:3001/api/questions/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUnreadCount(data.sellerUnread);
        })
        .catch(console.error);
    }
  }, [showNotifications, token]);

  // Polling de notificaciones no leídas
  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    const checkUnread = () => {
      fetch("http://localhost:3001/api/questions/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error();
        })
        .then((data) => {
          setUnreadCount(data.sellerUnread);
        })
        .catch(() => {});
    };

    checkUnread();
    const intervalId = setInterval(checkUnread, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  const handleSendReply = async (questionId: string) => {
    if (!token || !replyText.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/api/questions/${questionId}/answer`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          answer: replyText
        })
      });

      if (!res.ok) {
        throw new Error();
      }

      setReplyingToId(null);
      setReplyText("");
      
      const listRes = await fetch("http://localhost:3001/api/questions/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (listRes.ok) {
        const data = await listRes.json();
        setNotifications(data);
      }

      const countRes = await fetch("http://localhost:3001/api/questions/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        setUnreadCount(countData.sellerUnread);
      }
    } catch (err) {
      alert("Error al enviar la respuesta.");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/questions/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: "seller"
        })
      });

      if (res.ok) {
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, isReadBySeller: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    setShowCart(false);
    setShowUserMenu(false);
    router.push("/");
    router.refresh();
  };

  const updateCart = (newItems: typeof cartItems) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cart-change"));
  };

  const handleEmptyCart = () => {
    updateCart([]);
  };

  const handleRemoveOne = (id: string) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const handleAddOne = (id: string) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateCart(updated);
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
    <div className="flex items-center gap-3">
      {/* Mobile search indicator — hidden because search is always visible in the header */}
      <Link href="/search" className="hidden p-2 text-text-muted hover:text-foreground transition-colors md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </Link>

      {/* CTA Vender */}
      <Link
        href="/dashboard?tab=publish"
        className="sell-cta-pulse hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-green to-accent-green px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-background border border-accent-green/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
          <div ref={userMenuRef} className="relative">
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
              <span className="hidden md:inline-block text-xs font-bold text-foreground max-w-[180px] truncate">
                {profile ? `Bienvenido, ${profile.name}` : "Cargando..."}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted hidden md:block">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* Dropdown de Usuario */}
            {showUserMenu && (
              <>
                <div className="fixed md:absolute right-4 md:right-0 top-[125px] md:top-auto md:mt-3 w-52 rounded-2xl bg-card-bg-solid border border-card-border p-2.5 shadow-2xl z-50 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  <Link 
                    href="/compras" 
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground/80 hover:text-accent-gold hover:bg-card-border/30 transition-all w-full text-left cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                      <path d="M6 2 2 6v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6l-4-4z"></path>
                      <line x1="2" y1="6" x2="22" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Mis Compras
                  </Link>
                  <Link 
                    href="/favoritos"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground/80 hover:text-accent-gold hover:bg-card-border/30 transition-all w-full text-left cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    Mis Favoritos
                  </Link>
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
          <div ref={cartRef} className="relative">
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
                <div className="fixed md:absolute right-4 left-4 md:right-0 md:left-auto top-[125px] md:top-auto md:mt-3 w-auto md:w-80 rounded-2xl bg-card-bg-solid border border-card-border p-4 shadow-2xl z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
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
                          <div key={item.id} className="flex items-center justify-between gap-3 text-xs py-2 border-b border-card-border/10 last:border-b-0 animate-in fade-in duration-200">
                            <div className="flex-1 min-w-0">
                              <Link
                                  href={`/listings/${item.id}`}
                                onClick={() => setShowCart(false)}
                                className="font-bold text-foreground hover:text-accent-gold transition-colors block truncate cursor-pointer"
                                title={`Ver detalle de ${item.name}`}
                              >
                                {item.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-text-muted">Cant:</span>
                                <div className="flex items-center gap-1 bg-card-border/20 rounded-lg p-0.5 border border-card-border/30">
                                  <button
                                    onClick={() => handleRemoveOne(item.id)}
                                    className="p-1 rounded-md text-text-muted hover:text-red-500 hover:bg-card-border/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center h-5 w-5"
                                    title={item.quantity === 1 ? "Quitar artículo" : "Reducir cantidad"}
                                  >
                                    {item.quantity === 1 ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                      </svg>
                                    )}
                                  </button>
                                  <span className="font-bold text-[11px] px-1 min-w-[12px] text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => handleAddOne(item.id)}
                                    className="p-1 rounded-md text-text-muted hover:text-accent-gold hover:bg-card-border/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center h-5 w-5"
                                    title="Aumentar cantidad"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="12" y1="5" x2="12" y2="19"/>
                                      <line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="font-extrabold text-foreground whitespace-nowrap">
                                ${(item.price * item.quantity).toLocaleString("es-AR")}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[9px] text-text-muted">
                                  (${(item.price).toLocaleString("es-AR")} c/u)
                                </span>
                              )}
                            </div>
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

          {/* Campanita de Notificaciones */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowCart(false);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-text-muted hover:text-foreground transition-colors hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center rounded-xl bg-card-bg border border-card-border/80 hover:border-card-border h-9 w-9 shadow-sm"
              title="Notificaciones de consultas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center h-5 w-5 text-[9px] font-extrabold leading-none text-white bg-red-500 rounded-full border border-background shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown de Notificaciones */}
            {showNotifications && (
              <>
                <div className="fixed md:absolute right-4 left-4 md:right-0 md:left-auto top-[125px] md:top-auto md:mt-3 w-auto md:w-96 rounded-2xl bg-card-bg-solid border border-card-border p-4 shadow-2xl z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
                    <span className="text-xs font-heading font-extrabold text-foreground uppercase tracking-wider">Preguntas Recibidas</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] text-accent-gold hover:underline font-bold cursor-pointer"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-text-muted text-center py-6">No tenés ninguna consulta por el momento.</p>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3 rounded-xl border flex flex-col gap-2 text-xs transition-colors ${
                            !n.answer ? "bg-accent-gold/5 border-accent-gold/20" : "bg-card-bg border-card-border/50"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <span className="text-[9px] font-bold text-text-muted block uppercase">Publicación:</span>
                              <Link 
                                href={`/listings/${n.listingId}`}
                                onClick={() => setShowNotifications(false)}
                                className="font-bold text-foreground hover:text-accent-gold transition-colors line-clamp-1"
                              >
                                {n.listing.product.name}
                              </Link>
                            </div>
                            <span className="text-[9px] text-text-muted shrink-0">
                              {new Date(n.createdAt).toLocaleDateString("es-AR")}
                            </span>
                          </div>

                          <div className="bg-background/40 p-2.5 rounded-lg border border-card-border/40">
                            <span className="text-[9px] font-bold text-text-muted block mb-0.5">{n.buyer.fullName} pregunta:</span>
                            <p className="text-foreground leading-relaxed italic">"{n.question}"</p>
                          </div>

                          {n.answer ? (
                            <div className="bg-accent-green/5 p-2.5 rounded-lg border border-accent-green/15 flex flex-col gap-0.5">
                              <span className="text-[9px] font-bold text-accent-green block uppercase">Respondiste:</span>
                              <p className="text-text-muted">"{n.answer}"</p>
                            </div>
                          ) : (
                            <div className="mt-1">
                              {replyingToId === n.id ? (
                                <div className="flex flex-col gap-2">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Escribí tu respuesta..."
                                    className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-accent-gold resize-none h-16"
                                    required
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setReplyingToId(null);
                                        setReplyText("");
                                      }}
                                      className="px-2.5 py-1 text-[10px] rounded-lg border border-card-border hover:bg-card-bg/25 text-text-muted cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => handleSendReply(n.id)}
                                      disabled={!replyText.trim()}
                                      className="px-2.5 py-1 text-[10px] rounded-lg bg-gradient-to-r from-accent-gold to-accent-gold-hover text-background font-bold shadow-md cursor-pointer disabled:opacity-50"
                                    >
                                      Enviar Respuesta
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setReplyingToId(n.id);
                                    setReplyText("");
                                  }}
                                  className="w-full py-1.5 text-center text-[10px] font-bold rounded-lg border border-accent-gold/30 hover:border-accent-gold text-accent-gold hover:bg-accent-gold/5 transition-all cursor-pointer"
                                >
                                  Responder Consulta
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
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
