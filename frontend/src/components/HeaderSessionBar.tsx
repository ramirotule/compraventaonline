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

  useEffect(() => {
    setMounted(true);
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
          // Token is expired or seller doesn't exist
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  };

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

      {/* "+ Publicar" Button */}
      <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-card-bg px-4 py-2 text-xs font-bold text-accent-gold border border-accent-gold/20 hover:border-accent-gold/50 transition-all hover:shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Publicar
      </Link>

      {token ? (
        <div className="flex items-center gap-3">
          {/* User Profile Indicator */}
          <span className="hidden md:inline-block text-xs font-bold text-foreground max-w-[120px] truncate">
            {profile ? `👋 ${profile.name}` : "Cargando..."}
          </span>
          {/* Log out Button */}
          <button 
            onClick={handleLogout}
            className="rounded-xl border border-red-500/20 hover:border-red-500 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            Salir
          </button>
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
