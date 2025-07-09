import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LuPaintRoller, LuPaintbrush, LuPaintbrushVertical, LuPalette, LuPaintBucket, LuImage, LuCircleAlert, LuShare } from "react-icons/lu";
import { imageHelpers } from "@/lib/image-helpers";
import { ProviderTiming } from "@/hooks/useImageGeneration";
import styles from './styles.module.css';
import buttonStyles from '../../css/buttonStyles.module.css';

interface ImageDisplayProps {
  prompt?: string;
  image?: string;
  timing?: ProviderTiming;
  failed?: boolean;
  fallbackIcon?: React.ReactNode;
  enabled?: boolean;
}

export function ImageDisplay({
  prompt,
  image,
  timing,
  failed,
  fallbackIcon,
}: ImageDisplayProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const icons = [
    <LuPaintRoller key="roller" />,
    <LuPaintbrush key="brush" />,
    <LuPaintbrushVertical key="brushV" />,
    <LuPalette key="palette" />,
    <LuPaintBucket key="bucket" />,
  ];
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    if (timing?.completionTime) return;
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [timing?.startTime]);

  useEffect(() => {
    if (isZoomed) {
      window.history.pushState({ zoomed: true }, "");
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    const handlePopState = () => {
      if (isZoomed) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isZoomed]);

  const handleImageClick = (e: React.MouseEvent) => {
    if (image) {
      e.stopPropagation();
      setIsZoomed(true);
    }
  };

  const handleActionClick = (
    e: React.MouseEvent,
    imageData: string
  ) => {
    e.stopPropagation();
    imageHelpers.shareOrDownload(imageData, 'image').catch((error) => {
      console.error("Failed to share/download image:", error);
    });
  };

  return (
    <>
      <div className={styles.container}>
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={prompt} onClick={handleImageClick} />
            <div className={styles.info}>
              <button className={buttonStyles.iconButton} onClick={(e) => handleActionClick(e, image)}>
                <LuShare />
                {/* <LuDownload /> */}
              </button>
              {timing?.elapsed && (
                <div className={buttonStyles.iconButton + ' ' + styles.elapsed}>{(timing.elapsed / 1000).toFixed(1)}s</div>
              )}
              <div className={buttonStyles.iconButton + ' ' + styles.prompt}>
                {prompt}
              </div>
            </div>
          </>
        ) : failed ? (
          fallbackIcon || <LuCircleAlert className={styles.imagePlaceholder} />
        ) : timing?.startTime ? (
          <>
            <div className={styles.loading}>
              {icons[iconIndex]} <span>Generating...</span>
            </div>
            <div className={buttonStyles.iconButton + ' ' + styles.prompt}>
              {prompt}
            </div>
          </>
        ) : (
          <LuImage className={styles.imagePlaceholder} />
        )}
      </div>

      {isZoomed && image && createPortal(
        <div className={styles.zoomedOverlay} onClick={() => setIsZoomed(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={prompt || `AI Generated`} />
        </div>,
        document.body,
      )}
    </>
  );
}