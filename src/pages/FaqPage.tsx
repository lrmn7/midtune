import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "are these tracks really free to use?",
    a: "yes. every track on midtune is original, written and recorded for this archive. no samples, no third-party loops. you can use them in any creative project — personal or commercial — without paying anything or signing up.",
  },
  {
    q: "can i use them on youtube?",
    a: "yes. monetized or not, shorts or long-form, any channel size. if a content id false-flag ever happens (it shouldn't), dispute it — it's not from us and you'll be cleared.",
  },
  {
    q: "can i monetize my video?",
    a: "absolutely. monetized youtube videos, tiktok creator fund, instagram reels bonuses — all fine. there's no separate commercial license tier.",
  },
  {
    q: "do i need to credit midtune or L RMN?",
    a: "credit is appreciated but not required. if you'd like to, something like 'music: track title by L RMN — midtune' in a video description or credits screen is perfect.",
  },
  {
    q: "can i use the tracks in games or streams?",
    a: "yes. free and paid games, game jams, demos, livestreams on twitch, kick, youtube — all covered. vods and clips are fine too.",
  },
  {
    q: "can i remix or edit the tracks?",
    a: "absolutely. chop them, slow them, loop them, layer them, pitch-shift them, sing over them. the remix is yours. just don't upload remixes to spotify/apple music (that triggers content id and harms everyone).",
  },
  {
    q: "can i redistribute or resell the audio?",
    a: "no. don't repost the raw files as a download pack, upload them to stock music sites, or sell them standalone. link people to midtune instead. this rule protects the commons.",
  },
  {
    q: "why is it called copyright-safe / no-copyright?",
    a: "\"copyright-safe\" means you can use these tracks without worrying about copyright strikes or content id claims. the tracks are still authored works — the license just grants you broad free usage rights. you're safe to use them; you just can't claim ownership or redistribute them.",
  },
  {
    q: "what happens if i only need the audio url?",
    a: "click the 'audio url' button on any track card to copy the direct link to your clipboard. you can embed it, link it, or use it in any project. no download required.",
  },
  {
    q: "how do i report an issue?",
    a: "if you encounter a problem — a broken download, a false content id claim, or anything else — reach out via the contact information in the footer. we'll sort it out.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        questions, mostly
      </div>
      <h1 className="font-serif text-5xl mt-1">faq</h1>
      <p className="text-muted-foreground mt-3 text-lg">
        a short list. if it's not here, the answer is probably "yes, you can use it."
      </p>

      <div className="mt-10 divide-y divide-foreground/30 border-y border-foreground/30">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-start justify-between gap-4 py-4 text-left cursor-pointer group"
              >
                <span className="font-serif text-lg leading-snug group-hover:text-brown transition-colors">
                  {f.q}
                </span>
                <span className="mt-1 w-6 h-6 border border-foreground flex items-center justify-center shrink-0">
                  {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                </span>
              </button>
              {isOpen && (
                <p className="pb-5 pr-10 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
