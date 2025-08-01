import { CSSProperties } from "react";

// see https://github.com/megh-bari/pattern-craft/blob/main/src/app/utils/patterns.ts

export type StyleName = 'basic-grid' | 'grid-fade-diagonal-left' | 'grid-fade-sides';

const styles: Record<StyleName, CSSProperties> = {
  'basic-grid': {
    background: "light-dark( #ffffff, #0f172a )",
    backgroundImage: `
      linear-gradient(to right, light-dark( #e5e7eb, rgba(148,163,184,0.2)) 1px, transparent 1px),
      linear-gradient(to bottom, light-dark( #e5e7eb, rgba(148,163,184,0.2)) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
  },
  'grid-fade-diagonal-left': {
    background: "light-dark( #f9fafb, #151515)",
    backgroundImage: `
      linear-gradient(to right, light-dark(  #d1d5db, rgba(148,163,184,0.2)) 1px, transparent 1px),
      linear-gradient(to bottom, light-dark(  #d1d5db, rgba(148,163,184,0.2)) 1px, transparent 1px)
    `,
    backgroundSize: "32px 32px",
    WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
    maskImage: "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
  },
  'grid-fade-sides': {
    background: "light-dark( #f9fafb, #151515)",
    backgroundImage: `
      linear-gradient(to right, light-dark(  #d1d5db, rgba(148,163,184,0.2)) 1px, transparent 1px),
      linear-gradient(to bottom, light-dark(  #d1d5db, rgba(148,163,184,0.2)) 1px, transparent 1px)
    `,
    backgroundSize: "32px 32px",
    WebkitMaskImage: "linear-gradient(90deg, #fff, #0000, #0000, #fff)",
    maskImage: "linear-gradient(90deg, #fff, #0000, #0000, #fff)"
  }
};

export default function BackgroundPattern({ styleName }: { styleName?: StyleName }) {
  if (!styleName || !styles[styleName]) return null;
  const style: CSSProperties = styles[styleName];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1, ...style }} />
  );
}