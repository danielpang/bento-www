import { CtaLink } from "@/components/cta-link";
import { MacDownloads } from "@/components/mac-downloads";
import { MarketingHeader } from "@/components/marketing/header";
import { SiteFooter } from "@/components/site-footer";
import { getMacRelease, MAC_RELEASES_URL } from "@/lib/mac-releases";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import "./download.css";

export const metadata = pageMetadata({
  title: "Download Bento for Mac",
  description: "Get Bento for Apple silicon or Intel Macs. Choose your Mac's chip, download the app, and keep your agent pipeline close.",
  path: "/download",
});

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ download?: string }>;
}) {
  const [result, query] = await Promise.all([getMacRelease(), searchParams]);
  const release = result.status === "available" ? result.release : null;
  const retry = result.status === "error" || query.download === "retry";

  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main className="site-shell mac-download-page" id="main-content">
        <header className="mac-download-heading">
          <h1>Bento for Mac.</h1>
          <p>Your agent pipeline, right on your desktop. Choose the download for your Mac.</p>
        </header>
        {retry ? (
          <p className="mac-download-status" role="status">
            We could not check Mac downloads right now. <a href="/download">Try again</a> or check the <a href={MAC_RELEASES_URL}>GitHub releases</a>.
          </p>
        ) : !release ? (
          <p className="mac-download-status" role="status">
            Mac downloads are currently unavailable. Check the <a href={MAC_RELEASES_URL}>GitHub releases</a> for available downloads.
          </p>
        ) : query.download === "unavailable" ? (
          <p className="mac-download-status" role="status">That Mac download is not available. Choose an available version below.</p>
        ) : null}

        <MacDownloads release={release} />
        {release && <p className="mac-download-version">Version {release.version} · DMG installer · <a href={MAC_RELEASES_URL}>Release notes</a></p>}

        <section className="mac-chip-help" aria-labelledby="mac-chip-heading">
          <h2 id="mac-chip-heading">Which chip does my Mac have?</h2>
          <p>Open the Apple menu in the top left of your screen, then choose <strong>About This Mac</strong>.</p>
          <dl>
            <div><dt>Chip: Apple</dt><dd>Choose Apple silicon.</dd></div>
            <div><dt>Processor: Intel</dt><dd>Choose Intel.</dd></div>
          </dl>
          <a href="https://support.apple.com/en-us/116943">Apple’s guide to identifying your Mac’s chip</a>
        </section>

        <section className="mac-download-browser" aria-labelledby="mac-browser-heading">
          <div>
            <h2 id="mac-browser-heading">Bento is in your browser, too.</h2>
            <p>On Windows, Linux, or another device? Open the web app to keep your pipeline moving.</p>
          </div>
          <CtaLink href={siteConfig.signupUrl} variant="secondary">Open Bento in your browser</CtaLink>
        </section>
      </main>
      <SiteFooter {...siteConfig} showFinalCta={false} />
    </div>
  );
}
