import Link from 'next/link';
import { COMMODITIES_CONFIG } from '../lib/commodities-config';

export default function HomePage() {
  return (
    <main className="sg-main">
      <h1 className="sg-title">PLATAFORMA <span className="sg-accent">SPREADGREG</span></h1>
      <div className="sg-menu-grid">
        {COMMODITIES_CONFIG.map(cfg => (
          <Link key={cfg.id} href={`/${cfg.id}`} className="sg-menu-card">
            {cfg.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
