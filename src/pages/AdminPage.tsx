import { useState, useCallback, useMemo } from "react";
import { Lock, Plus, Pencil, Trash2, Check, X, LogOut, Search, Upload } from "lucide-react";
import { adminLogin, adminCreateTrack, adminUpdateTrack, adminDeleteTrack, adminListTracks, adminUploadAudio } from "@/services/admin";
import type { TrackInput } from "@/types";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const t = await adminLogin(password);
      setToken(t);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="paper-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={20} />
            <h1 className="font-serif text-3xl">admin</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            enter the admin password to manage tracks. this area is protected by server-side
            authentication.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin password"
              className="w-full bg-surface border border-foreground px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brown mb-3"
              autoFocus
              required
            />
            {loginError && (
              <p className="text-destructive text-sm mb-3 font-mono">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full px-4 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-brown transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? "authenticating…" : "log in"}
            </button>
          </form>
          <p className="mt-6 text-[11px] text-muted-foreground font-mono uppercase tracking-wide">
            for production: protect /admin with cloudflare access / zero trust as an additional
            layer.
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard token={token} onLogout={() => setToken(null)} />;
}

function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tracks, setTracks] = useState<TrackInput[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<TrackInput | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "az" | "za">("newest");

  const filteredTracks = useMemo(() => {
    let r = tracks.filter((t) => {
      if (
        q &&
        !t.title.toLowerCase().includes(q.toLowerCase()) &&
        !t.author.toLowerCase().includes(q.toLowerCase()) &&
        !t.id.toLowerCase().includes(q.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    r.sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.year.localeCompare(a.year);
        case "oldest":
          return a.year.localeCompare(b.year);
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
      }
      return 0;
    });
    return r;
  }, [tracks, q, sort]);

  const loadTracks = useCallback(async () => {
    try {
      const data = await adminListTracks(token);
      setTracks(Array.isArray(data) ? data : []);
      setLoaded(true);
    } catch (err) {
      setError("Failed to load tracks. The API may not be connected yet.");
      setLoaded(true);
    }
  }, [token]);

  if (!loaded) {
    loadTracks();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            admin panel
          </div>
          <h1 className="font-serif text-4xl mt-1">manage tracks</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-foreground font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-yellow-tape transition-colors"
        >
          <LogOut size={12} /> log out
        </button>
      </div>

      {error && (
        <div className="paper-card p-4 mb-6 bg-yellow-tape/30">
          <p className="text-sm">{error}</p>
          <p className="text-xs text-muted-foreground mt-1">
            the admin api requires cloudflare d1 to be configured. you can still use the form below
            to prepare track data.
          </p>
        </div>
      )}

      {!creating && !editing && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-brown transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} /> add track
          </button>

          {loaded && tracks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="search title, author, id…"
                  className="w-full bg-surface border border-foreground pl-9 pr-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brown"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-surface border border-foreground px-3 py-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                <option value="newest">sort: newest</option>
                <option value="oldest">sort: oldest</option>
                <option value="az">sort: a-z</option>
                <option value="za">sort: z-a</option>
              </select>
            </div>
          )}
        </div>
      )}

      {creating && (
        <TrackForm
          token={token}
          onSubmit={async (track) => {
            try {
              await adminCreateTrack(token, track);
              setCreating(false);
              loadTracks();
            } catch {
              // Error handled in form
            }
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {editing && (
        <TrackForm
          initial={editing}
          token={token}
          onSubmit={async (track) => {
            try {
              await adminUpdateTrack(token, track);
              setEditing(null);
              loadTracks();
            } catch {
              // Error handled in form
            }
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loaded && tracks.length > 0 && !creating && !editing && (
        <div className="space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            showing {filteredTracks.length} of {tracks.length} tracks
          </div>
          {filteredTracks.length === 0 ? (
            <div className="paper-card p-10 text-center">
              <div className="font-serif text-2xl">no tracks found.</div>
              <p className="text-muted-foreground mt-1 text-sm">
                try a different search term.
              </p>
            </div>
          ) : (
            filteredTracks.map((t) => (
              <div key={t.id} className="paper-card p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="font-serif text-lg truncate leading-none">{t.title}</div>
                    <div className="tape-chip bg-yellow-tape shrink-0 scale-[0.8] origin-left hidden sm:block">
                      {t.id}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.author} · {t.year} · {t.bpm} bpm · key of {t.tuning} ·{" "}
                    {Math.floor(t.durationSec / 60)}:{String(t.durationSec % 60).padStart(2, "0")}
                  </div>
                  {t.moods && t.moods.length > 0 && (
                    <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mt-1.5 opacity-70">
                      moods: {t.moods.join(", ")}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(t)}
                    className="p-2 border border-foreground hover:bg-yellow-tape transition-colors cursor-pointer"
                    aria-label="Edit track"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${t.title}"?`)) {
                        await adminDeleteTrack(token, t.id);
                        loadTracks();
                      }
                    }}
                    className="p-2 border border-foreground hover:bg-destructive hover:text-background transition-colors cursor-pointer"
                    aria-label="Delete track"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const emptyTrack: TrackInput = {
  id: "",
  title: "",
  author: "L RMN",
  year: new Date().toISOString().slice(0, 10),
  bpm: 100,
  duration: "0:00",
  durationSec: 0,
  moods: [],
  tuning: "",
  audioUrl: "",
};

function TrackForm({
  initial,
  token,
  onSubmit,
  onCancel,
}: {
  initial?: TrackInput;
  token: string;
  onSubmit: (track: TrackInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [track, setTrack] = useState<TrackInput>(initial ?? emptyTrack);
  const [moodInput, setMoodInput] = useState(initial?.moods.join(", ") ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof TrackInput, v: unknown) => setTrack((p) => ({ ...p, [k]: v }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!track.title.trim()) e.title = "title is required";
    if (!track.author.trim()) e.author = "author is required";
    if (!track.year.match(/^\d{4}-\d{2}-\d{2}$/)) e.year = "use ISO format: YYYY-MM-DD";
    if (!track.audioUrl.trim()) e.audioUrl = "audio url is required";
    try {
      new URL(track.audioUrl);
    } catch {
      if (track.audioUrl.trim()) e.audioUrl = "invalid url";
    }
    if (!track.tuning.trim()) e.tuning = "key is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const finalTrack = {
      ...track,
      id: track.id.trim() || generateId(track.title),
      moods: moodInput
        .split(",")
        .map((m) => m.trim().toLowerCase())
        .filter(Boolean),
    };
    try {
      await onSubmit(finalTrack);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setErrors({ form: "Failed to save. Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const url = await adminUploadAudio(token, file);
      setTrack((p) => ({ ...p, audioUrl: url }));
      // Optional: attempt to parse duration from file if possible, or leave to manual
    } catch (err) {
      setErrors((prev) => ({ ...prev, audioUrl: "Failed to upload file to R2" }));
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="paper-card p-6 mb-6 space-y-4">
      <h2 className="font-serif text-2xl mb-4">{initial ? "edit track" : "add new track"}</h2>

      <Field label="title *" error={errors.title}>
        <input
          value={track.title}
          onChange={(e) => set("title", e.target.value)}
          className="field-input"
          placeholder="drowning in my own wave"
        />
      </Field>

      <Field label="id (auto-generated if empty)">
        <input
          value={track.id}
          onChange={(e) => set("id", e.target.value)}
          className="field-input"
          placeholder={track.title ? generateId(track.title) : "auto-generated-from-title"}
        />
      </Field>

      <Field label="author *" error={errors.author}>
        <input
          value={track.author}
          onChange={(e) => set("author", e.target.value)}
          className="field-input"
          placeholder="L RMN"
        />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="release date *" error={errors.year}>
          <input
            type="date"
            value={track.year}
            onChange={(e) => set("year", e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="bpm">
          <input
            type="number"
            value={track.bpm}
            onChange={(e) => set("bpm", Number(e.target.value))}
            className="field-input"
            min={30}
            max={300}
          />
        </Field>
        <Field label="key *" error={errors.tuning}>
          <input
            value={track.tuning}
            onChange={(e) => set("tuning", e.target.value)}
            className="field-input"
            placeholder="G"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="duration (mm:ss)">
          <input
            value={track.duration}
            onChange={(e) => {
              const val = e.target.value;
              let sec = 0;
              if (val.includes(":")) {
                const parts = val.split(":");
                if (parts.length === 2) {
                  const m = parseInt(parts[0], 10) || 0;
                  const s = parseInt(parts[1], 10) || 0;
                  sec = m * 60 + s;
                }
              } else {
                sec = parseInt(val, 10) || 0;
              }
              setTrack((p) => ({ ...p, duration: val, durationSec: sec }));
            }}
            className="field-input"
            placeholder="3:42"
          />
        </Field>
        <Field label="duration (seconds)">
          <input
            type="number"
            value={track.durationSec}
            disabled
            className="field-input opacity-50 cursor-not-allowed"
          />
        </Field>
      </div>

      <Field label="moods (comma separated)">
        <input
          value={moodInput}
          onChange={(e) => setMoodInput(e.target.value)}
          className="field-input"
          placeholder="melancholy, nostalgic"
        />
      </Field>

      <Field label="audio url *" error={errors.audioUrl}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={track.audioUrl}
            onChange={(e) => set("audioUrl", e.target.value)}
            className="field-input flex-1"
            placeholder="https://files.listune.app/midwest-emo/track-name.wav"
          />
          <div className="relative shrink-0">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingFile}
            />
            <div
              className={`flex items-center gap-2 px-4 py-2.5 border border-foreground font-mono text-xs uppercase tracking-wider transition-colors ${
                uploadingFile ? "opacity-50 bg-secondary" : "hover:bg-yellow-tape cursor-pointer"
              }`}
            >
              <Upload size={14} />
              {uploadingFile ? "uploading..." : "upload to r2"}
            </div>
          </div>
        </div>
      </Field>

      {errors.form && <p className="text-destructive text-sm font-mono">{errors.form}</p>}
      {success && (
        <p className="text-olive text-sm font-mono flex items-center gap-1">
          <Check size={14} /> saved successfully
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-brown transition-colors disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "saving…" : initial ? "update track" : "add track"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-foreground font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-secondary transition-colors"
        >
          <X size={12} /> cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-destructive text-xs mt-0.5 font-mono">{error}</p>}
    </div>
  );
}
