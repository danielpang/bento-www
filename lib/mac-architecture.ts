import type { MacArchitecture } from "./mac-releases";

interface UserAgentHints {
  platform?: string;
  mobile?: boolean;
  getHighEntropyValues?: (hints: string[]) => Promise<{
    architecture?: string;
    bitness?: string;
  }>;
}

/**
 * This is an optional suggestion, never an automatic download or redirect.
 * MacIntel / "Intel Mac OS X" also appear on Apple silicon. Safari provides
 * no UA Client Hints, so it must retain the manual choice.
 * https://developer.chrome.com/docs/privacy-security/user-agent-client-hints
 */
export async function suggestMacArchitecture(hints?: UserAgentHints): Promise<MacArchitecture | null> {
  if (hints?.platform !== "macOS" || hints.mobile || !hints.getHighEntropyValues) return null;
  try {
    const { architecture, bitness } = await hints.getHighEntropyValues(["architecture", "bitness"]);
    if (bitness !== "64") return null;
    if (architecture === "arm") return "arm64";
    if (architecture === "x86") return "x64";
  } catch {
    // Browsers may withhold high-entropy hints or reject the request.
  }
  return null;
}

export function browserMacArchitecture(): Promise<MacArchitecture | null> {
  return suggestMacArchitecture((navigator as Navigator & { userAgentData?: UserAgentHints }).userAgentData);
}
