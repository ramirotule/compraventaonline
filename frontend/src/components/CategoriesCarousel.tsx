"use client";

import React, { useState } from "react";
import Link from "next/link";


interface Category {
  name: string;
  slug: string;
  icon: string;
  count: string;
}

const CATEGORIES: Category[] = [
  // Page 1 (9 items)
  { name: "Tecnología", slug: "tecnologia", icon: "💻", count: "124" },
  { name: "Hogar", slug: "hogar", icon: "🛋️", count: "89" },
  { name: "Vehículos", slug: "vehiculos", icon: "🚗", count: "210" },
  { name: "Campo / Agro", slug: "campo-agro", icon: "🌾", count: "450" },
  { name: "Construcción", slug: "construccion", icon: "🧱", count: "78" },
  { name: "Moda", slug: "moda", icon: "👕", count: "115" },
  { name: "Servicios", slug: "servicios", icon: "🔧", count: "64" },
  { name: "Coleccionables", slug: "coleccionables", icon: "🏺", count: "32" },
  { name: "Deportes", slug: "deportes", icon: "⚽", count: "95" },
  // Page 2 (9 items)
  { name: "Belleza", slug: "belleza", icon: "💅", count: "142" },
  { name: "Libros", slug: "libros", icon: "📚", count: "53" },
  { name: "Música", slug: "musica", icon: "🎸", count: "76" },
  { name: "Mascotas", slug: "mascotas", icon: "🐶", count: "112" },
  { name: "Bebés", slug: "bebes", icon: "👶", count: "83" },
  { name: "Inmuebles", slug: "inmuebles", icon: "🏢", count: "156" },
  { name: "Juegos", slug: "juegos", icon: "🎮", count: "68" },
  { name: "Arte", slug: "arte", icon: "🎨", count: "47" },
  { name: "Alimentos", slug: "alimentos", icon: "🍷", count: "193" },
];

const ITEMS_PER_PAGE = 9;
const TOTAL_PAGES = Math.ceil(CATEGORIES.length / ITEMS_PER_PAGE);

export default function CategoriesCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
  };

  // Split categories into chunks of 9 for each page
  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) =>
    CATEGORIES.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
  );

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div 
        className="relative w-full overflow-hidden px-1 py-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageItems, pageIdx) => (
            <div 
              key={pageIdx} 
              className="w-full shrink-0 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-12"
            >
              {pageItems.map((cat) => (
                <Link 
                  key={cat.slug} 
                  href={`/search?category=${cat.slug}`}
                  className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl glass-card text-center group hover:scale-[1.02] active:scale-[0.98] transition-all hover:border-accent-gold/40 border border-card-border/50"
                >
                  <span className="text-2xl sm:text-4xl mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110 select-none">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-foreground group-hover:text-accent-gold transition-colors truncate max-w-full px-1">
                    {cat.name}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-text-muted mt-0.5 sm:mt-1">
                    {cat.count} publ.
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Left/Right Arrows) */}
      <button
        type="button"
        onClick={prevPage}
        aria-label="Categorías anteriores"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-card-bg-solid/80 border border-card-border backdrop-blur-md shadow-md transition-all duration-300 hover:bg-accent-gold/10 hover:border-accent-gold/40 hover:text-accent-gold cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextPage}
        aria-label="Siguientes categorías"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-card-bg-solid/80 border border-card-border backdrop-blur-md shadow-md transition-all duration-300 hover:bg-accent-gold/10 hover:border-accent-gold/40 hover:text-accent-gold cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-5">
        {Array.from({ length: TOTAL_PAGES }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentPage(idx)}
            aria-label={`Ir a página de categorías ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentPage
                ? "w-5 bg-accent-gold"
                : "w-1.5 bg-foreground/25 hover:bg-foreground/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
