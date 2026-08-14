"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, BarChart2, LogOut,
  Menu, X, ChevronRight, Boxes,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes, exact: false },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2, exact: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0d0d18 0%, #080810 100%)",
        borderRight: "1px solid #ffffff0d",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid #ffffff0d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "0.6rem",
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, boxShadow: "0 0 20px #3b82f640",
          }}>
            <Package size={18} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#f5f6fa", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>RareDexCards</div>
            <div style={{ color: "#6b6b80", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "0.75rem 0.75rem", flex: 1 }}>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "0.65rem",
                padding: "0.65rem 0.875rem", borderRadius: "0.75rem",
                marginBottom: "0.15rem",
                background: active ? "linear-gradient(90deg, #3b82f618, #3b82f608)" : "transparent",
                border: active ? "1px solid #3b82f625" : "1px solid transparent",
                color: active ? "#f5f6fa" : "#6b6b80",
                textDecoration: "none", fontSize: "0.875rem", fontWeight: active ? 700 : 500,
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "#ffffff06"; (e.currentTarget as HTMLAnchorElement).style.color = "#a1a1b5"; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#6b6b80"; } }}
            >
              <Icon size={16} color={active ? "#3b82f6" : "currentColor"} />
              {label}
              {active && <ChevronRight size={12} style={{ marginLeft: "auto", color: "#3b82f6" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid #ffffff0d" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "0.65rem", width: "100%",
            padding: "0.65rem 0.875rem", borderRadius: "0.75rem",
            background: "transparent", border: "1px solid transparent",
            color: "#6b6b80", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
            transition: "all 0.18s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ef444415"; (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#6b6b80"; }}
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#08080c", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="admin-sidebar-desktop">
        {sidebarContent}
      </div>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
          onClick={() => setSidebarOpen(false)}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          <div style={{ position: "relative", zIndex: 10 }} onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile top bar */}
        <header
          style={{
            display: "flex", alignItems: "center", gap: "1rem",
            padding: "0.875rem 1.25rem",
            background: "#0d0d18", borderBottom: "1px solid #ffffff0d",
            position: "sticky", top: 0, zIndex: 40,
          }}
          className="admin-topbar"
        >
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1b5", padding: "0.25rem" }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ color: "#f5f6fa", fontWeight: 700, fontSize: "0.95rem" }}>RareDexCards Admin</span>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {children}
        </main>
      </div>

      {/* Styles to show sidebar on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-topbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
