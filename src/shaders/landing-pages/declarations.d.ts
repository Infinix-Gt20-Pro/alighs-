declare module "*?raw" {
  const content: string;
  export default content;
}

declare module "../tidecrest-hero/tidecrestDocument.js" {
  export const buildTidecrestDocument: ((variant: any) => any) | undefined;
}

declare module "../meridian-landing-page/meridianDocument.js" {
  export const buildMeridianDocument: ((variant: any, presentation?: any) => any) | undefined;
}

declare module "../ascii-field/asciiFieldDocuments.js" {
  export const buildAsciiFieldDocument: (variant: any) => any;
}

declare module "../betawise-globe/betawiseGlobeDocument.js" {
  export const buildBetawiseGlobeDocument: ((variant: any) => any) | undefined;
}

declare module "../nocturne-hero/NocturneScene" {
  export const NOCTURNE_TITLES: Record<string, string>;
  export const NOCTURNE_VARIANTS: readonly string[];
  export const buildNocturneDocument: (variant: any) => any;
  export type NocturneVariant = string;
}

declare module "./sandboxedPageDocument" {
  export const buildSandboxedPageDocument: (source: any, options?: any) => any;
}

declare module "../sylva-living-world/SylvaLivingWorldScene" {
  export const MAPLE_AUTUMN_STYLE: string;
  export const SAKURA_SUNSET_STYLE: string;
  export const SEQUOIA_MIST_STYLE: string;
  export const applyMapleAutumnVariant: (source: string) => string;
  export const applySakuraSunsetVariant: (source: string) => string;
  export const applySequoiaMistVariant: (source: string) => string;
}
