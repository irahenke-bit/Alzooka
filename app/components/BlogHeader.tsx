"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { Logo } from "./Logo";

type BlogHeaderProps = {
  user: { id: string } | null;
  userUsername: string | null;
  userAvatarUrl: string | null;
};

export default function BlogHeader({ user, userUsername, userAvatarUrl }: BlogHeaderProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="blog-header">
      <div className="blog-header-inner">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <Logo size={32} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Alzooka</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 14, opacity: 0.85 }}>
            Journal
          </Link>
          {!user && (
            <Link href="/login" style={{ fontSize: 14, opacity: 0.85 }}>
              Sign in
            </Link>
          )}
          {user && userUsername ? (
            <>
              <Link href={`/profile/${userUsername}`} style={{ fontSize: 14, opacity: 0.85 }}>
                Profile
              </Link>
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-expanded={menuOpen}
                  aria-label="Account menu"
                >
                  {userAvatarUrl ? (
                    <img src={userAvatarUrl} alt="" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                      {userUsername.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 160,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-default)",
                      borderRadius: 8,
                      padding: 8,
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        void handleSignOut();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-primary)",
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
