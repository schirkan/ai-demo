import { CSSProperties } from "react";

// see https://github.com/megh-bari/pattern-craft/blob/main/src/app/utils/patterns.ts

export type StyleName = 'basic-grid' | 'diagonal-fade-grid-left';

const styles: Record<StyleName, CSSProperties> = {
  'basic-grid': {
    background: "light-dark( #ffffff, #0f172a )",
    backgroundImage: `
      linear-gradient(to right, light-dark( #e5e7eb, rgba(148,163,184,0.2)) 1px, transparent 1px),
      linear-gradient(to bottom, light-dark( #e5e7eb, rgba(148,163,184,0.2)) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
  },
  'diagonal-fade-grid-left': {
    background: "light-dark( #f9fafb, #202020)",
    backgroundImage: `
      linear-gradient(to right, light-dark(  #d1d5db, rgba(148,163,184,0.2)) 1px, transparent 1px),
      linear-gradient(to bottom, light-dark(  #d1d5db, rgba(148,163,184,0.2)) 1px, transparent 1px)
    `,
    backgroundSize: "32px 32px",
    WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
    maskImage: "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
  }
};

export default function BackgroundPattern({ styleName }: { styleName?: StyleName }) {
  if (!styleName || !styles[styleName]) return null;
  const style: CSSProperties = styles[styleName];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1, ...style }} />
  );
}