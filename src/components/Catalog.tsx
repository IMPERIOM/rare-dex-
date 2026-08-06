"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { products, allBrands } from "@/lib/products";
import {
  CATEGORY_LABELS,
  AVAILABILITY_LABELS,
  type Availability,
  type ProductCategory,
} from "@/lib/types";
import { ProductCard } from "./ProductCard";

type SortKey = "popularity" | "newest" | "name";
type Mode = "all" | "graded" | "clearance" | "new" | "preorder";

const AVAILS = Object.keys(AVAILABILITY_LABELS) as Availability[];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function Catalog({ mode = "all", title }: { mode?: Mode; title?: string }) {
  const params = useSearchParams();
  const initialCategory = params.get("category") as ProductCategory | null;
  const q = params.get("q")?.toLowerCase().trim() ?? "";

  const [categories, setCategories] = useState<ProductCategory[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [brands, setBrands] = useState<string[]>([]);
  const [avails, setAvails] = useState<Availability[]>([]);
  const [sort, setSort] = useState<SortKey>("popularity");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (mode === "graded") return !!p.grading;
      if (mode === "clearance") return !!p.isClearance;
      if (mode === "new") return !!p.isNew || !!p.isPreOrder;
      if (mode === "preorder") return !!p.isPreOrder;
      return true;
    });
    if (q)
      list = list.filter((p) =>
        `${p.name} ${p.set} ${p.brand} ${p.sku} ${p.category}`.toLowerCase().includes(q),
      );
    if (categories.length) list = list.filter((p) => categories.includes(p.category));
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (avails.length) list = list.filter((p) => avails.includes(p.availability));

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.popularity - a.popularity);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [mode, q, categories, brands, avails, sort]);

  function clearAll() {
    setCategories([]);
    setBrands([]);
    setAvails([]);
  }

  const CATS = Object.keys(CATEGORY_LABELS) as ProductCategory[];

  const Check = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-muted transition hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-line-strong bg-transparent text-royal accent-royal"
      />
      {label}
    </label>
  );

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-line py-4">
      <h3 className="mb-2 text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  );

  const filters = (
    <div>
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm font-bold text-ink">Filters</span>
        <button onClick={clearAll} className="text-xs font-semibold text-royal hover:underline">
          Clear all
        </button>
      </div>
      {mode === "all" && (
        <Group title="Category">
          <div className="max-h-52 overflow-y-auto pr-1">
            {CATS.map((c) => (
              <Check key={c} label={CATEGORY_LABELS[c]} checked={categories.includes(c)} onChange={() => setCategories((v) => toggle(v, c))} />
            ))}
          </div>
        </Group>
      )}
      <Group title="Brand / Line">
        {allBrands().map((b) => (
          <Check key={b} label={b} checked={brands.includes(b)} onChange={() => setBrands((v) => toggle(v, b))} />
        ))}
      </Group>
      <Group title="Availability">
        {AVAILS.map((a) => (
          <Check key={a} label={AVAILABILITY_LABELS[a]} checked={avails.includes(a)} onChange={() => setAvails((v) => toggle(v, a))} />
        ))}
      </Group>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            {title ?? "Wholesale Catalog"}
          </h1>
          <p className="mt-1 text-sm text-faint">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {q && <> for “<span className="text-ink">{q}</span>”</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white/[0.03] px-3 py-2 text-sm text-ink lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm font-medium text-ink outline-none focus:border-royal"
          >
            <option value="popularity">Most popular</option>
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">{filters}</aside>
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line py-20 text-center">
              <p className="text-sm text-muted">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="glass-strong absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-base font-bold text-ink">Filters</span>
              <button onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 text-muted hover:bg-white/10" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
