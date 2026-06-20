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
              <ThemeToggle />
              <HeaderSessionBar />
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
