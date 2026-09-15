const fs = require('fs');
const path = require('path');
const https = require('https');

const stubs = [
  {
    path: 'src/shaders/tidecrest-hero/tidecrestDocument.js',
    code: 'export const buildTidecrestDocument = undefined;\n'
  },
  {
    path: 'src/shaders/tidecrest-hero/tidecrestDocument.d.ts',
    code: 'export const buildTidecrestDocument: ((variant: any) => any) | undefined;\n'
  },
  {
    path: 'src/shaders/meridian-landing-page/meridianDocument.js',
    code: 'export const buildMeridianDocument = undefined;\n'
  },
  {
    path: 'src/shaders/meridian-landing-page/meridianDocument.d.ts',
    code: 'export const buildMeridianDocument: ((variant: any, presentation?: any) => any) | undefined;\n'
  },
  {
    path: 'src/shaders/ascii-field/asciiFieldDocuments.js',
    code: 'export const buildAsciiFieldDocument = (v) => "";\n'
  },
  {
    path: 'src/shaders/ascii-field/asciiFieldDocuments.d.ts',
    code: 'export const buildAsciiFieldDocument: (variant: any) => any;\n'
  },
  {
    path: 'src/shaders/betawise-globe/betawiseGlobeDocument.js',
    code: 'export const buildBetawiseGlobeDocument = undefined;\n'
  },
  {
    path: 'src/shaders/betawise-globe/betawiseGlobeDocument.d.ts',
    code: 'export const buildBetawiseGlobeDocument: ((variant: any) => any) | undefined;\n'
  },
  {
    path: 'src/shaders/nocturne-hero/NocturneScene.ts',
    code: 'export const NOCTURNE_TITLES: Record<string, string> = {};\nexport const NOCTURNE_VARIANTS: readonly string[] = [];\nexport type NocturneVariant = string;\nexport const buildNocturneDocument = (v: any) => "";\n'
  },
  {
    path: 'src/shaders/landing-pages/sandboxedPageDocument.ts',
    code: 'export function buildSandboxedPageDocument(source: string, options?: any) {\n  return source;\n}\n'
  },
  {
    path: 'src/shaders/sylva-living-world/SylvaLivingWorldScene.ts',
    code: 'export const MAPLE_AUTUMN_STYLE = "";\nexport const SAKURA_SUNSET_STYLE = "";\nexport const SEQUOIA_MIST_STYLE = "";\nexport const applyMapleAutumnVariant = (s: string) => s;\nexport const applySakuraSunsetVariant = (s: string) => s;\nexport const applySequoiaMistVariant = (s: string) => s;\n'
  },
  {
    path: 'src/shaders/sylva-living-world/sources/inner-green-3d.html',
    code: '<!DOCTYPE html><html><head></head><body><div class="pill-clip"></div></body></html>\n'
  },
  {
    path: 'src/shaders/axonis-field/axonis-arbor.html',
    code: '<!DOCTYPE html><html><head></head><body></body></html>\n'
  },
  {
    path: 'src/shaders/axonis-field/axonis-vortex.html',
    code: '<!DOCTYPE html><html><head></head><body></body></html>\n'
  },
  {
    path: 'src/shaders/axonis-field/axonis-tide.html',
    code: '<!DOCTYPE html><html><head></head><body></body></html>\n'
  },
  {
    path: 'src/shaders/axonis-field/axonis-dune.html',
    code: '<!DOCTYPE html><html><head></head><body></body></html>\n'
  }
];

for (const s of stubs) {
  const p = path.join(__dirname, '..', s.path);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s.code, 'utf8');
  console.log('Created stub:', s.path);
}

// Download font
const fontDest = path.join(__dirname, '..', 'src/shaders/fonts/fragment-mono.woff2');
fs.mkdirSync(path.dirname(fontDest), { recursive: true });
const file = fs.createWriteStream(fontDest);
https.get('https://threeui.com/shaders/fonts/fragment-mono.woff2', (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded font: src/shaders/fonts/fragment-mono.woff2');
  });
}).on('error', console.error);
