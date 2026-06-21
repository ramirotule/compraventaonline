"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [sellerType, setSellerType] = useState<"PERSONAL_SELLER" | "BUSINESS_SELLER">("PERSONAL_SELLER");
  const [documentNumber, setDocumentNumber] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const res = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error al iniciar sesión.");
        }

        // Save token & redirect
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("auth-change"));
        setSuccessMsg("¡Inicio de sesión exitoso! Redireccionando...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);

      } else {
        // --- REGISTER FLOW (Sequential onboarding) ---
        if (!acceptTerms) {
          throw new Error("Debes aceptar los términos y condiciones de la comunidad.");
        }

        // 1. Auth Register
        const regRes = await fetch("http://localhost:3001/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.message || "Error al crear la cuenta.");
        }

        // 2. Auth Login (to retrieve token)
        const logRes = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const logData = await logRes.json();
        if (!logRes.ok) {
          throw new Error("Cuenta creada, pero falló el inicio de sesión automático. Por favor inicia sesión.");
        }

        const token = logData.token;
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("auth-change"));

        // 3. Accept Terms on DB
        await fetch("http://localhost:3001/api/legal/accept", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ acceptedTerms: true, version: "1.0" }),
        });

        // 4. Register Seller profile
        const sellerRes = await fetch("http://localhost:3001/api/sellers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: sellerType,
            name: fullName,
            documentNumber,
          }),
        });

        const sellerData = await sellerRes.json();
        if (!sellerRes.ok) {
          throw new Error(sellerData.message || "Registro completado, pero falló la creación del perfil de vendedor.");
        }

        setSuccessMsg("¡Registro exitoso y perfil de vendedor creado! Redireccionando...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 w-full flex flex-col gap-6">
      <div className="text-center">
        <span className="text-4xl">🌾</span>
        <h1 className="font-heading text-2xl font-extrabold text-foreground mt-4">
          {isLogin ? "Ingresá a tu Cuenta" : "Registrate en la Plataforma"}
        </h1>
        <p className="text-text-muted text-xs mt-1">
          {isLogin 
            ? "Conectá con compradores y vendedores de toda La Pampa." 
            : "Creá tu perfil de vendedor y empezá a publicar gratis."
          }
        </p>
      </div>

      <div className="rounded-3xl bg-card-bg border border-card-border p-8 shadow-xl">
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-xs font-semibold mb-6">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-xl p-3 text-xs font-semibold mb-6">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name (Registration only) */}
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground">Nombre Completo / Razón Social</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan Pérez o Ferretería Luro" 
                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com" 
              className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground">Contraseña</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres" 
              className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Seller Setup (Registration only) */}
          {!isLogin && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground">Tipo de Vendedor</label>
                <div className="grid grid-cols-2 gap-3 bg-background border border-card-border p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setSellerType("PERSONAL_SELLER")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sellerType === "PERSONAL_SELLER" ? "bg-accent-gold text-background shadow-md" : "text-text-muted hover:text-foreground"
                    }`}
                  >
                    Particular
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSellerType("BUSINESS_SELLER")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sellerType === "BUSINESS_SELLER" ? "bg-accent-gold text-background shadow-md" : "text-text-muted hover:text-foreground"
                    }`}
                  >
                    Comercio
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground">
                  {sellerType === "PERSONAL_SELLER" ? "DNI / CUIL" : "CUIT"}
                </label>
                <input 
                  type="text" 
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder={sellerType === "PERSONAL_SELLER" ? "Ej. 20-35444333-8" : "Ej. 30-71112223-9"} 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent-gold"
                />
              </div>

              <div className="flex items-start gap-2.5 mt-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-card-border bg-background text-accent-gold accent-accent-gold focus:ring-accent-gold"
                />
                <label htmlFor="terms" className="text-xs text-text-muted select-none leading-relaxed cursor-pointer">
                  Acepto los <Link href="/terms" className="text-accent-gold hover:underline">Términos y Condiciones</Link> y las <Link href="/rules" className="text-accent-gold hover:underline">Reglas de la Comunidad</Link> de CompraVentaOnline.
                </label>
              </div>
            </>
          )}

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-hover py-4 text-xs font-extrabold text-background shadow-md hover:opacity-95 transition-all mt-4 disabled:opacity-50 cursor-pointer"
          >
            {loading 
              ? (isLogin ? "Iniciando sesión..." : "Registrando perfil...") 
              : (isLogin ? "Ingresar" : "Crear Perfil Comercial")
            }
          </button>
        </form>

        <div className="border-t border-card-border/50 pt-5 mt-6 text-center text-xs text-text-muted">
          {isLogin ? (
            <p>
              ¿No tenés una cuenta?{" "}
              <button 
                type="button" 
                onClick={() => setIsLogin(false)}
                className="text-accent-gold font-bold hover:underline cursor-pointer"
              >
                Registrate como vendedor
              </button>
            </p>
          ) : (
            <p>
              ¿Ya estás registrado?{" "}
              <button 
                type="button" 
                onClick={() => setIsLogin(true)}
                className="text-accent-gold font-bold hover:underline cursor-pointer"
              >
                Ingresá con tu cuenta
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
