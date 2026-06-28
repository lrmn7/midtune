import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { PlayerProvider } from "@/context/PlayerContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingPlayer } from "@/components/player/FloatingPlayer";
import HomePage from "@/pages/HomePage";
import TracksPage from "@/pages/TracksPage";
import LicensePage from "@/pages/LicensePage";
import FaqPage from "@/pages/FaqPage";
import AdminPage from "@/pages/AdminPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PlayerProvider>
        <div className="relative min-h-screen flex flex-col" style={{ zIndex: 2 }}>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tracks" element={<TracksPage />} />
              <Route path="/license" element={<LicensePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <FloatingPlayer />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: "var(--surface)",
              border: "1px solid var(--ink)",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            },
          }}
        />
      </PlayerProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground font-serif">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground font-serif">page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-brown transition-colors"
          >
            go home
          </a>
        </div>
      </div>
    </div>
  );
}
