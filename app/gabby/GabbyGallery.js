'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './gabby.module.css';

export default function GabbyGallery({ photos }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const active = activeIndex === null ? null : photos[activeIndex];

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => {
    setActiveIndex((index) => (index === null ? 0 : (index - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const next = useCallback(() => {
    setActiveIndex((index) => (index === null ? 0 : (index + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, close, next, previous]);

  return (
    <>
      <section className={styles.galleryGrid} aria-label="Gabby final photo gallery">
        {photos.map((photo, index) => (
          <article
            className={`${styles.galleryItem} ${styles[photo.orientation]} ${index % 7 === 1 || index % 11 === 6 ? styles.emphasis : ''}`}
            key={photo.id}
          >
            <button
              type="button"
              className={styles.imageButton}
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${photo.name}, image ${index + 1} of ${photos.length}`}
            >
              <Image
                src={photo.preview}
                alt={`Gabby portrait ${index + 1}`}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
                className={styles.galleryImage}
              />
              <span className={styles.imageOverlay}>
                <span>{photo.number} / {photos.length}</span>
                <span>View image ↗</span>
              </span>
            </button>
            <div className={styles.imageMeta}>
              <span>{photo.number}</span>
              <span>{photo.name.replace('.jpg', '')}</span>
              <a href={photo.download} download aria-label={`Download ${photo.name}`}>Download ↓</a>
            </div>
          </article>
        ))}
      </section>

      {active && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`${active.name} enlarged`}>
          <button type="button" className={styles.lightboxBackdrop} onClick={close} aria-label="Close image viewer" />

          <div className={styles.lightboxTopbar}>
            <span>{String(activeIndex + 1).padStart(2, '0')} / {photos.length}</span>
            <span>{active.name.replace('.jpg', '')}</span>
            <div>
              <a href={active.download} download>Download ↓</a>
              <button type="button" onClick={close}>Close ×</button>
            </div>
          </div>

          <div className={`${styles.lightboxImageWrap} ${styles[active.orientation]}`}>
            <Image
              src={active.preview}
              alt={`Gabby portrait ${activeIndex + 1}`}
              fill
              priority
              sizes="95vw"
              className={styles.lightboxImage}
            />
          </div>

          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={previous} aria-label="Previous photo">←</button>
          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={next} aria-label="Next photo">→</button>
        </div>
      )}
    </>
  );
}
