import { createClient } from '@insforge/sdk';

const baseUrl =
  process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7fxjpnj5.us-east.insforge.app';
const anonKey =
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
  'anon_1a0e92c20cc2ede88a0ea27a1f5d75df6d965523ddae1c6052b927290f4f565c';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export default insforge;
