import { createClient } from '@insforge/sdk';

const baseUrl =
  process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7fxjpnj5.us-east.insforge.app';

// On server-side (Next.js API routes / SSR), use INSFORGE_API_KEY if available for authoritative database operations
// In client browser, use NEXT_PUBLIC_INSFORGE_ANON_KEY (browser respects RLS)
const apiKey =
  (typeof window === 'undefined'
    ? process.env.INSFORGE_API_KEY || 'ik_a65122a10f512c700497de812a0e796a'
    : null) ||
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
  'anon_1a0e92c20cc2ede88a0ea27a1f5d75df6d965523ddae1c6052b927290f4f565c';

// Ensure mobile browser sessions don't lose PKCE verifier during external OAuth app switches
if (typeof window !== 'undefined') {
  try {
    const pkceKey = 'insforge_pkce_verifier';
    const fallbackVerifier = localStorage.getItem(pkceKey);
    if (fallbackVerifier && !sessionStorage.getItem(pkceKey)) {
      sessionStorage.setItem(pkceKey, fallbackVerifier);
    }
  } catch {
    // Ignore storage restrictions in private mode
  }
}

export const insforge = createClient({
  baseUrl,
  anonKey: apiKey,
});

export default insforge;

