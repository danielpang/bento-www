export function isSignupDestination(
  href: string,
  signupUrl: string | null,
): boolean {
  if (!signupUrl) return false;
  try {
    const target = new URL(href);
    const signup = new URL(signupUrl);
    return target.origin === signup.origin && target.pathname === signup.pathname;
  } catch {
    return false;
  }
}
