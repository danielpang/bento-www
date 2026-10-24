import { MarketingHeader } from "@/components/marketing/header";
import { SwarmHero } from "@/components/swarms/swarm-hero";
import { pageMetadata } from "@/lib/metadata";
import "./swarms.css";

export const metadata = pageMetadata({
  title: "Swarms",
  description: "One goal. A swarm of agents. Explore coordinated work across ambiguous features, migrations, and parallel initiatives with Bento.",
  path: "/swarms",
});

export default function SwarmsPage() {
  return <div className="marketing-page swarms-page"><MarketingHeader /><main id="main-content"><SwarmHero /></main></div>;
}
