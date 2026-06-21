import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import HeaderSessionBar from "../components/HeaderSessionBar";

export const metadata: Metadata = {
  title: "CompraVentaOnline - El Marketplace de La Pampa",
  description: "Compra y venta de productos nuevos y usados en La Pampa, Argentina. Encuentra las mejores ofertas de comercios locales y usuarios particulares.",
  keywords: "La Pampa, Santa Rosa, General Pico, compra, venta, marketplace, clasificados, nuevo, usado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light' || saved === 'dark') {
                    document.documentElement.setAttribute('data-theme', saved);
                  } else {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans bg-background text-foreground antialiased selection:bg-accent-gold selection:text-background">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/85 backdrop-blur-md">
          <div className="flex h-16 w-full items-center justify-between pr-4 sm:pr-6 lg:pr-8">
            
            {/* Logo — pegado al borde izquierdo */}
            <Link href="/" className="ml-[5px] flex shrink-0 items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-between rounded-xl bg-gradient-to-tr from-accent-gold to-accent-green p-2 shadow-lg transition-transform group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-background">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent-gold to-accent-green bg-clip-text text-transparent">
                  CompraVentaOnline
                </span>
                <span className="text-[10px] font-medium tracking-widest text-accent-gold/80 -mt-1 uppercase">
                  La Pampa
                </span>
              </div>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
              <Link href="/" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Inicio
              </Link>
              <Link href="/destacados" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-accent-gold stroke-foreground stroke-[1.5] drop-shadow-sm animate-pulse">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.321 21.38c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                Destacados
              </Link>
              <Link href="/search" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Buscar
              </Link>
              <Link href="/envios" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Envíos & Logística
              </Link>
              <Link href="/support" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Ayuda
              </Link>
            </nav>

            {/* User Session Bar + theme (toggle al extremo derecho) */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <HeaderSessionBar />
              <div className="ml-1 pl-3 sm:pl-4 border-l border-card-border/40">
                <ThemeToggle />
              </div>
            </div>

          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1">
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="border-t border-card-border bg-background py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold tracking-tight bg-gradient-to-r from-accent-gold to-accent-green bg-clip-text text-transparent">
                  CompraVentaOnline.com.ar
                </span>
                <span className="text-xs text-text-muted">
                  © 2026 - Conectando La Pampa.
                </span>
              </div>
              <div className="flex gap-6 text-xs text-text-muted">
                <Link href="/terms" className="hover:text-accent-gold transition-colors">
                  Términos y Condiciones
                </Link>
                <Link href="/privacy" className="hover:text-accent-gold transition-colors">
                  Privacidad
                </Link>
                <Link href="/support" className="hover:text-accent-gold transition-colors">
                  Soporte
                </Link>
                <Link href="/envios" className="hover:text-accent-gold transition-colors">
                  Envíos & Logística
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
