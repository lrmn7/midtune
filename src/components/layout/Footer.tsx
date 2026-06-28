import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-foreground/80 bg-surface/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" aria-label="Midtune home" className="inline-block">
            <Logo size="md" />
          </Link>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs leading-relaxed">
            a curated archive of free, copyright-safe midwest emo instrumentals. recorded honestly,
            given away freely, made for someone else's project.
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest">
          <div className="text-muted-foreground mb-3">archive</div>
          <ul className="space-y-2">
            <li>
              <Link to="/tracks" className="hover:text-brown transition-colors">
                browse tracks
              </Link>
            </li>
            <li>
              <Link to="/license" className="hover:text-brown transition-colors">
                license
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-brown transition-colors">
                faq
              </Link>
            </li>
          </ul>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest">
          <div className="text-muted-foreground mb-3">info</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>all tracks subject to midtune license</li>
            <li>no ads, no signups, no tracking</li>
            <li>
              <a
                href="https://ko-fi.com/eleremen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                donate / ko-fi
              </a>
            </li>
            <li>
              <a
                href="mailto:support@listune.app"
                className="hover:text-foreground transition-colors"
              >
                support@listune.app
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-foreground/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} midtune · all tracks free to use under license</span>
          <span>
            made with ❤️ by{" "}
            <a
              href="https://bio.eleremen.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors hover:underline"
            >
              L RMN
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
