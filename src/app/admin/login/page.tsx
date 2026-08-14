"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Package } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #08080c 0%, #0f0f1e 50%, #08080c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* Background glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, #3b82f618 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, #7c3aed14 0%, transparent 70%)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        {/* Logo / brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "64px", height: "64px", borderRadius: "1rem",
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            marginBottom: "1rem", boxShadow: "0 0 40px #3b82f640",
          }}>
            <Package size={32} color="#fff" />
          </div>
          <h1 style={{ color: "#f5f6fa", fontSize: "1.5rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            RareDexCards
          </h1>
          <p style={{ color: "#6b6b80", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
            Admin Panel
          </p>
        </div>

        {/* Login card */}
        <div style={{
          background: "linear-gradient(180deg, #16161f 0%, #101018 100%)",
          border: "1px solid #ffffff14",
          borderRadius: "1.25rem",
          padding: "2rem",
          boxShadow: "0 20px 50px -12px rgba(0,0,0,0.7)",
        }}>
          <h2 style={{ color: "#f5f6fa", fontSize: "1.125rem", fontWeight: 700, margin: "0 0 1.5rem 0" }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#a1a1b5", fontSize: "0.8rem", marginBottom: "0.4rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#6b6b80" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@raredexcards.com"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.03)", border: "1px solid #ffffff20",
                    borderRadius: "0.75rem", padding: "0.75rem 1rem 0.75rem 2.5rem",
                    color: "#f5f6fa", fontSize: "0.9rem", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={e => (e.target.style.borderColor = "#ffffff20")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", color: "#a1a1b5", fontSize: "0.8rem", marginBottom: "0.4rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#6b6b80" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.03)", border: "1px solid #ffffff20",
                    borderRadius: "0.75rem", padding: "0.75rem 2.5rem 0.75rem 2.5rem",
                    color: "#f5f6fa", fontSize: "0.9rem", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={e => (e.target.style.borderColor = "#ffffff20")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b6b80", padding: 0 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#ef444415", border: "1px solid #ef444430", borderRadius: "0.625rem", padding: "0.75rem 1rem", color: "#fca5a5", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                background: loading ? "#1d4ed8" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff", border: "none", borderRadius: "0.75rem",
                padding: "0.85rem 1.5rem", fontSize: "0.95rem", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px #3b82f650",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#6b6b80", fontSize: "0.75rem", marginTop: "1.5rem" }}>
          This page is not publicly accessible and is only for internal use.
        </p>
      </div>
    </div>
  );
}
