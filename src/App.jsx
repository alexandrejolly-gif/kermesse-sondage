import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import VoteView from "./components/VoteView";
import ResultsView from "./components/ResultsView";
import AdminView from "./components/AdminView";
import { T } from "./styles/theme";

export default function App() {
  const [view, setView] = useState("vote");
  const [cfg, setCfg] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Google Font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Fetch config from Supabase
  const fetchConfig = useCallback(async () => {
    const { data, error } = await supabase
      .from("config")
      .select("*")
      .eq("id", "main")
      .single();
    if (!error && data) setCfg(data);
  }, []);

  // Fetch responses from Supabase
  const fetchResponses = useCallback(async () => {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setResponses(data);
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      await Promise.all([fetchConfig(), fetchResponses()]);
      setLoading(false);
    })();
  }, [fetchConfig, fetchResponses]);

  // Save config via Vercel API route (uses service_role key server-side)
  const saveCfg = async (updates) => {
    // Update local state immediately so UI stays consistent
    setCfg((prev) => ({ ...prev, ...updates }));

    try {
      const res = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      // Verify we got a real JSON response (not index.html served by Vite)
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        await fetchConfig();
      }
    } catch {
      // API unavailable (local dev without vercel), local state still updated
    }
  };

  // Delete a single response via Vercel API route
  const deleteResponse = async (id) => {
    try {
      const res = await fetch(`/api/delete-response?id=${id}`, {
        method: "DELETE",
      });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        await fetchResponses();
      }
    } catch {
      // API unavailable in local dev
    }
  };

  // Reset all responses via Vercel API route
  const resetResponses = async () => {
    try {
      const res = await fetch("/api/reset-responses", { method: "DELETE" });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        setResponses([]);
      }
    } catch {
      // API unavailable in local dev
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: T.font,
          color: T.muted,
        }}
      >
        Chargement…
      </div>
    );

  return (
    <div
      style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}
    >
      <Header
        cfg={cfg}
        view={view}
        setView={setView}
        respCount={responses.length}
      />
      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "1.25rem 0.9rem 3rem",
        }}
      >
        {view === "vote" && (
          <VoteView
            cfg={cfg}
            responses={responses}
            refreshResponses={fetchResponses}
          />
        )}
        {view === "results" && (
          <ResultsView cfg={cfg} responses={responses} />
        )}
        {view === "admin" && (
          <AdminView
            cfg={cfg}
            responses={responses}
            saveCfg={saveCfg}
            deleteResponse={deleteResponse}
            resetResponses={resetResponses}
          />
        )}
      </main>
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          color: T.hint,
          fontSize: "0.73rem",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        🎪 Sondage Kermesse
      </footer>
    </div>
  );
}
