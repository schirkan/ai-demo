import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LuCircleAlert, LuImage, LuPaintBucket, LuPaintRoller, LuPaintbrush, LuPaintbrushVertical, LuPalette, LuShare } from "react-icons/lu";
import { BsArrowClockwise, BsPencilSquare } from "react-icons/bs";
import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';
import type { ProviderTiming } from "@/hooks/useImageGeneration";
import { imageHelpers } from "@/utils/image-helpers";

interface ImageDisplayProps {
  prompt?: string;
  image?: string;
  timing?: ProviderTiming;
  error?: Error;
  reload?: () => void;
  edit?: () => void;
}

const icons = [
  <LuPaintRoller key="roller" />,
  <LuPaintbrush key="brush" />,
  <LuPaintbrushVertical key="brushV" />,
  <LuPalette key="palette" />,
  <LuPaintBucket key="bucket" />,
];

export function ImageDisplay({ prompt, image, timing, error, reload, edit }: ImageDisplayProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    if (!timing?.startTime || timing.completionTime) return;
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [timing?.completionTime, timing?.startTime]);

  useEffect(() => {
    if (!isZoomed) return;

    window.history.pushState({ zoomed: true }, "");

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };

    const handlePopState = () => {
      setIsZoomed(false);
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("popstate", handlePopState);

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
        {prompt && (
          <div className={buttonStyles.iconButton + ' ' + styles.prompt}>
            {prompt}
          </div>
        )}

        {image && (
          <img src={image} alt={prompt} onClick={handleImageClick} />
        )}

        {error && (
          <>
            <LuCircleAlert className={styles.imagePlaceholder} />
            <div className={styles.error}>
              <div className={styles.errorMessage}>Error: {error.message}</div>
            </div>
          </>
        )}

        {timing?.startTime && !timing.completionTime && (
          <div className={styles.loading}>
            <div className={styles.loader}></div>
            {icons[iconIndex]}
          </div>
        )}

        {!image && !error && !timing?.startTime && (
          <LuImage className={styles.imagePlaceholder} />
        )}

        <div className={styles.info}>
          {prompt && edit && (
            <button onClick={edit} className={styles.editButton + " " + buttonStyles.iconButton}>
              <BsPencilSquare />
            </button>
          )}

          {(image || error) && reload && (
            <button onClick={reload} className={styles.reloadButton + " " + buttonStyles.iconButton}>
              <BsArrowClockwise />
            </button>
          )}

          {timing?.elapsed && (
            <div className={buttonStyles.iconButton + ' ' + styles.elapsed}>{(timing.elapsed / 1000).toFixed(1)}s</div>
          )}

          {image && (
            <button className={buttonStyles.iconButton} onClick={(e) => handleActionClick(e, image)}>
              <LuShare />{/* <LuDownload /> */}
            </button>
          )}
        </div>
      </div>

      {isZoomed && image && createPortal(
        <div className={styles.zoomedOverlay} onClick={() => setIsZoomed(false)}>
          <img src={image} alt={prompt || `AI Generated`} />
        </div>,
        document.body,
      )}
    </>
  );
}