export interface SiteEnv {
  NEXT_PUBLIC_SIGNUP_URL?: string;
  NEXT_PUBLIC_GITHUB_URL?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

function publicUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function makeSiteConfig(env: SiteEnv) {
  const canonical =
    publicUrl(env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000/";

  return {
    signupUrl: publicUrl(env.NEXT_PUBLIC_SIGNUP_URL),
    githubUrl: publicUrl(env.NEXT_PUBLIC_GITHUB_URL),
    siteUrl: new URL(canonical),
  };
}

export const siteConfig = makeSiteConfig({
  NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
  NEXT_PUBLIC_SIGNUP_URL: process.env.NEXT_PUBLIC_SIGNUP_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
