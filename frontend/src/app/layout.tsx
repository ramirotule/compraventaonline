import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
    <html lang="es" className="h-full scroll-smooth">
      <body className="flex min-h-screen flex-col font-sans bg-background text-foreground antialiased selection:bg-accent-gold selection:text-background">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
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
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Inicio
              </Link>
              <Link href="/search" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Buscar
              </Link>
              <Link href="/dashboard" className="text-sm font-semibold text-foreground/80 hover:text-accent-gold transition-colors">
                Panel Vendedor
              </Link>
            </nav>

            {/* User Session Bar */}
            <div className="flex items-center gap-4">
              <Link href="/search" className="p-2 text-text-muted hover:text-foreground transition-colors md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </Link>
              
              <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-card-bg px-4 py-2 text-xs font-bold text-accent-gold border border-accent-gold/20 hover:border-accent-gold/50 transition-all hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Publicar
              </Link>

              <Link href="/login" className="rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover px-5 py-2 text-xs font-extrabold text-background shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Ingresar
              </Link>
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
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
