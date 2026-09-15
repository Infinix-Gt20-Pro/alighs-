"use client";

import React, { useMemo, useRef, type CSSProperties } from "react";
import creatorStudioIntroSource from "./sources/creator-studio-intro.html?raw";

export type TextAnimationCollectionProps = {
  variant?: string;
  text?: string;
  mode?: "light" | "dark";
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
  logoSvg?: string;
};

const THREEUI_MARK_SVG = `<svg viewBox="0 0 512 512" aria-hidden="true">
  <defs>
    <mask id="threeui-intro-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <rect width="512" height="512" fill="#000"/>
      <circle cx="256" cy="256" r="208" fill="#fff"/>
      <g fill="none" stroke="#000" stroke-linecap="round" stroke-width="28">
        <path d="M36 178C112 252 184 264 260 196C336 128 404 114 482 180"/>
        <path d="M36 292C112 366 184 378 260 310C336 242 404 228 482 294"/>
      </g>
    </mask>
  </defs>
  <rect width="512" height="512" fill="#ffffff" mask="url(#threeui-intro-cut)"/>
</svg>`;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function buildIntroDocument(
  source: string,
  mode: "light" | "dark",
  wordmarkText: string,
  fontSize: number,
  logoSvg: string
) {
  const targetJson = JSON.stringify([{ selector: "#stage", role: "background" }]).replace(/</g, "\\u003c");
  const hiddenTargetJson = JSON.stringify([".sr"]).replace(/</g, "\\u003c");
  const introWordmark = {
    sceneSelector: "#comp .scene:first-child",
    text: wordmarkText,
    fontSize,
    endTime: 1.7,
    holdTime: 1.2,
    logoSvg,
  };
  const introWordmarkJson = JSON.stringify(introWordmark).replace(/</g, "\\u003c");
  const modeJson = JSON.stringify(mode);

  const focusStyle = `<style data-threeui-focus>
html, body {
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  background: transparent !important;
  color-scheme: ${mode} !important;
}
body {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
}
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-hidden] { display: none !important; }
[data-threeui-role="background"] {
  position: relative !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  background: transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 1 !important;
  pointer-events: none !important;
}
#stage {
  position: relative !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  aspect-ratio: auto !important;
  background: transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
}
#comp {
  position: relative !important;
  left: auto !important;
  top: auto !important;
  margin: 0 !important;
  width: 100% !important;
  height: 100% !important;
  transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
}
.scene {
  position: relative !important;
  inset: auto !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
}
.line {
  position: relative !important;
  inset: auto !important;
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.tx {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: ${fontSize}px !important;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif !important;
  font-weight: 900 !important;
  letter-spacing: -0.02em !important;
  white-space: nowrap !important;
  color: #ffffff !important;
  text-shadow: 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(99,102,241,0.35) !important;
}
.tx span {
  display: inline-block !important;
  color: #ffffff !important;
}
.mark {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  vertical-align: middle !important;
  margin-right: 0.25em !important;
  width: 0.85em !important;
  height: 0.85em !important;
}
.mark svg {
  width: 100% !important;
  height: 100% !important;
  fill: #ffffff !important;
}
</style>`;

  const focusScript = `<script data-threeui-focus>
(function () {
  document.documentElement.dataset.sfMode = ${modeJson};
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${targetJson};
    var hiddenSelectors = ${hiddenTargetJson};
    var introWordmark = ${introWordmarkJson};
    var roots = [];
    hiddenSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        element.setAttribute('data-threeui-hidden', '');
        element.setAttribute('aria-hidden', 'true');
        if ('inert' in element) element.inert = true;
      });
    });
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (spec.fit) element.setAttribute('data-threeui-fit', spec.fit);
      if (spec.preserveTransform) element.setAttribute('data-threeui-preserve-transform', '');
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (introWordmark) {
      var introScene = document.querySelector(introWordmark.sceneSelector);
      var introText = introScene && introScene.querySelector('.tx');
      var introMark = introText && introText.querySelector('.mark');
      if (introText && introMark) {
        introMark.innerHTML = introWordmark.logoSvg;
        var introCharacters = Array.from(introText.children).filter(function (element) { return element !== introMark; });
        introCharacters.forEach(function (element, index) {
          element.textContent = introWordmark.text[index] === ' ' ? '\\u00a0' : (introWordmark.text[index] || '');
          element.style.display = index < introWordmark.text.length ? 'inline-block' : 'none';
        });
      }
      var introReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var introStartedAt = performance.now();
      function renderIntroWordmark(now) {
        if (typeof window.__seek !== 'function') return;
        if (introReducedMotion) {
          window.__seek(introWordmark.endTime);
          return;
        }
        var introCycle = introWordmark.endTime + introWordmark.holdTime;
        var introTime = ((now - introStartedAt) / 1000) % introCycle;
        window.__seek(Math.min(introTime, introWordmark.endTime));
        requestAnimationFrame(renderIntroWordmark);
      }
      requestAnimationFrame(renderIntroWordmark);
    }
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) {
      var placeholderLink = root.matches('a[href="#"]') ? root : root.querySelector('a[href="#"]');
      if (placeholderLink) placeholderLink.addEventListener('click', function (event) { event.preventDefault(); });
      document.body.appendChild(root);
    });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      if (element.tagName.toLowerCase() === 'script' && element.hasAttribute('data-threeui-focus')) return;
      element.setAttribute('data-threeui-residual', '');
    });
    document.body.setAttribute('data-threeui-ready', '');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', isolate, { once: true });
  } else {
    isolate();
  }
})();
</script>`;

  return source
    .replace(/<base[^>]*>/i, "")
    .replace(/<\/head>/i, `${focusStyle}</head>`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

export function TextAnimationCollection({
  variant = "threeui-intro",
  text,
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
  className,
  style,
  logoSvg = THREEUI_MARK_SVG,
}: TextAnimationCollectionProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const safeMode: "light" | "dark" = mode === "light" ? "light" : "dark";

  // Resolve target text:
  // If text prop is passed, use it.
  // If variant is "threeui-intro" or "Intro Text", default to "ThreeUI".
  // Otherwise, use variant as the displayed text string (e.g. "ALIGH'S WARE").
  const resolvedText = useMemo(() => {
    if (text) return text;
    if (variant === "threeui-intro" || variant === "Intro Text") return "ThreeUI";
    return variant || "ALIGH'S WARE";
  }, [text, variant]);

  // Optical font size: 54-64px renders large, gorgeous, high-impact heading without clipping
  const fontSize = useMemo(() => {
    if (resolvedText === "ThreeUI") return 72;
    if (resolvedText.length > 10) return 56;
    return 64;
  }, [resolvedText]);

  const source = useMemo(() => {
    return buildIntroDocument(creatorStudioIntroSource, safeMode, resolvedText, fontSize, logoSvg);
  }, [safeMode, resolvedText, fontSize, logoSvg]);

  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      ref={frameRef}
      className={className}
      data-mode={safeMode}
      title={`ThreeUI chromatic wordmark - ${resolvedText}`}
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background: "transparent",
        backgroundColor: "transparent",
        filter,
        ...style,
      }}
    />
  );
}

export default TextAnimationCollection;
