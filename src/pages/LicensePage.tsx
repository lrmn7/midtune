import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        the fine print
      </div>
      <h1 className="font-serif text-5xl mt-1">the midtune license</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
        every instrumental on midtune is free to use. you don't need to email us, fill anything
        out, or pay anything. these are the rules in plain words.
      </p>

      <section className="mt-10 grid sm:grid-cols-2 gap-4">
        <div className="paper-card p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-olive flex items-center gap-1.5">
            <Check size={14} /> you can
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>· use tracks in youtube, tiktok, and instagram videos (monetized is fine)</li>
            <li>· use tracks in twitch, kick, or youtube livestreams</li>
            <li>· use tracks in indie games, demos, game jams, and published titles</li>
            <li>· use tracks in podcasts, short films, documentaries, and animations</li>
            <li>· use tracks in commercial projects (clients, brands, ads, presentations)</li>
            <li>· use tracks in personal edits, montages, and creative projects</li>
            <li>· remix, chop, slow, layer, pitch-shift, or transform a track</li>
            <li>· copy the audio url and embed or link it in your own project</li>
          </ul>
        </div>
        <div className="paper-card p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-destructive flex items-center gap-1.5">
            <X size={14} /> you can't
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>· upload the raw track to spotify, apple music, or other streaming dsps</li>
            <li>· resell the audio file as a standalone product or beat</li>
            <li>· redistribute the archive (mirror, repost as a pack, stock music library)</li>
            <li>· claim it as your own composition or original work</li>
            <li>· register it with a content id system (it will false-flag other users)</li>
            <li>· use it in an nft, ai training dataset, or similar extractive context</li>
          </ul>
        </div>
      </section>

      <Section title="credit">
        <p>
          credit is appreciated but not required. if you want to, something simple like this is
          plenty:
        </p>
        <pre className="paper-card p-3 mt-2 font-mono text-xs whitespace-pre-wrap">
          music: "track title" by L RMN — midtune (midwest.listune.app)
        </pre>
        <p className="mt-2 text-muted-foreground text-sm">
          in a youtube description, game credits screen, or wherever makes sense. no specific
          format is enforced.
        </p>
      </Section>

      <Section title="remixes & edits">
        <p>
          flip it, slow it, screw it, sing over it — your remix is yours. if you release it
          publicly, the original midtune attribution is appreciated. do not upload remixes to
          streaming services (spotify, apple music, etc.) as that triggers content id and harms
          everyone else using the same track.
        </p>
      </Section>

      <Section title="youtube, tiktok & instagram">
        <p>
          all platforms, all formats. monetized videos are completely fine. if a content id
          false-flag ever happens (it shouldn't), dispute it — it's not from us.
        </p>
      </Section>

      <Section title="livestreams">
        <p>
          use any track during a livestream on twitch, kick, youtube, or any other platform. vods
          and clips are also covered.
        </p>
      </Section>

      <Section title="games & interactive projects">
        <p>
          free and paid games, game jams, demos, interactive installations, vr experiences — all
          fine. credit in your game's credits screen is appreciated.
        </p>
      </Section>

      <Section title="commercial creative use">
        <p>
          client work, brand videos, advertisements, corporate presentations, trade show booths —
          all covered. there is no separate commercial license tier.
        </p>
      </Section>

      <Section title="why the rules exist">
        <p className="text-muted-foreground">
          this archive only stays free if no one weaponizes content id against people using these
          tracks honestly. that's the whole reason for the "no resale / no redistribution /
          no streaming dsp upload" rules. they protect the commons.
        </p>
      </Section>

      <Section title="scope">
        <p className="text-muted-foreground">
          this license applies only to tracks officially listed on midtune at{" "}
          <a href="https://midwest.listune.app" className="underline hover:text-brown">
            midwest.listune.app
          </a>
          . tracks obtained from other sources or modified versions hosted elsewhere are not
          covered by this license.
        </p>
      </Section>

      <div className="mt-12 paper-card p-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            ready?
          </div>
          <div className="font-serif text-2xl">go grab a track.</div>
        </div>
        <Link
          to="/tracks"
          className="px-4 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-brown transition-colors"
        >
          browse archive →
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
