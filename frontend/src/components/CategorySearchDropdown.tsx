"use client";

import { useState, useEffect } from "react";

interface Category {
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  defaultValue: string;
}

export default function CategorySearchDropdown({ categories, defaultValue }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Category>(
    categories.find((c) => c.slug === defaultValue) || categories[0]
  );

  // Sync selection if defaultValue changes (e.g. form reset or URL params update)
  useEffect(() => {
    const matched = categories.find((c) => c.slug === defaultValue);
    if (matched) {
      setSelected(matched);
    } else {
      setSelected(categories[0]);
    }
  }, [defaultValue, categories]);

  const filtered = categories.filter((cat) => {
    if (cat.slug === "") return true; // Keep "Todas las categorías" always visible
    return cat.name.toLowerCase().includes(search.toLowerCase()) || 
           cat.slug.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="relative w-full">
      {/* Hidden input to submit with the HTML Form */}
      <input type="hidden" name="category" value={selected.slug} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background border border-card-border rounded-xl px-3 py-2 text-xs text-foreground text-left focus:outline-none focus:border-accent-gold flex items-center justify-between cursor-pointer select-none"
      >
        <span className="truncate">{selected.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted shrink-0 ml-1">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          {/* Backdrop to close click outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute left-0 mt-2 w-full rounded-2xl bg-card-bg-solid border border-card-border p-3 shadow-2xl z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Input inside Dropdown */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-card-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2 text-text-muted hover:text-foreground text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* List of categories */}
            <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <span className="text-[10px] text-text-muted text-center py-4">No se encontraron categorías</span>
              ) : (
                filtered.map((cat) => {
                  const isSelected = cat.slug === selected.slug;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        setSelected(cat);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`text-left px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? "bg-accent-gold/20 text-accent-gold font-bold" 
                          : "text-foreground/80 hover:bg-card-border/30"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <span className="text-accent-gold text-[10px]">✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
