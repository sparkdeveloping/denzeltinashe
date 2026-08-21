import Image from 'next/image';
import GabbyGallery from './GabbyGallery';
import styles from './gabby.module.css';

export const metadata = {
  title: 'Gabby — Client Gallery | Denzel Tinashe',
  description: 'Client photo delivery gallery photographed by Denzel Tinashe.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: 'https://client.denzeltinashe.com/gabby',
  },
};

const names = [
  'FPC_8347.jpg', 'FPC_8348.jpg', 'FPC_8349.jpg', 'FPC_8350.jpg',
  'FPC_8351.jpg', 'FPC_8354.jpg', 'FPC_8355.jpg', 'FPC_8357.jpg',
  'FPC_8435.jpg', 'FPC_8438.jpg', 'FPC_8439.jpg', 'FPC_8440.jpg',
  'FPC_8445.jpg', 'FPC_8450.jpg', 'FPC_8452.jpg', 'FPC_8453.jpg',
  'FPC_8454.jpg', 'FPC_8456.jpg', 'FPC_8457.jpg', 'FPC_8459.jpg',
  'FPC_8460.jpg', 'FPC_8461.jpg', 'FPC_8462.jpg', 'FPC_8464.jpg',
  'FPC_8465.jpg', 'FPC_8467.jpg', 'FPC_8468.jpg', 'FPC_8470.jpg',
];

const portraitNames = new Set([
  'FPC_8347.jpg', 'FPC_8348.jpg', 'FPC_8349.jpg', 'FPC_8350.jpg', 'FPC_8351.jpg',
  'FPC_8453.jpg', 'FPC_8456.jpg', 'FPC_8459.jpg', 'FPC_8462.jpg', 'FPC_8464.jpg',
  'FPC_8465.jpg', 'FPC_8468.jpg',
]);

const photos = names.map((name, index) => ({
  id: name.replace('.jpg', ''),
  name,
  number: String(index + 1).padStart(2, '0'),
  orientation: portraitNames.has(name) ? 'portrait' : 'landscape',
  preview: `/client/gabby/preview/${name}`,
  download: `/client/gabby/downloads/${name}`,
}));

export default function GabbyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="https://www.denzeltinashe.com" aria-label="Denzel Tinashe portfolio">
          <span>DT</span>
          <i aria-hidden />
        </a>
        <span className={styles.navLabel}>Client delivery</span>
        <a className={styles.navDownload} href="/client/gabby/Gabby-Final-Gallery.zip" download>
          Download all <span aria-hidden>↓</span>
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <Image
            src="/client/gabby/preview/FPC_8438.jpg"
            alt="Portrait from Gabby's photo session"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroShade} />
        </div>

        <div className={styles.heroTopline}>
          <span>Portrait session</span>
          <span>28 final images</span>
        </div>

        <div className={styles.heroTitleWrap}>
          <p>Photographed by Denzel Tinashe</p>
          <h1>Gabby<span>.</span></h1>
        </div>

        <div className={styles.heroFooter}>
          <p>
            Your final gallery is ready. View the full set, open any image larger,
            or download individual photographs below.
          </p>
          <a href="#gallery" className={styles.enterGallery}>
            Enter gallery <span aria-hidden>↓</span>
          </a>
        </div>
      </section>

      <section className={styles.intro} id="gallery">
        <div>
          <p className={styles.kicker}>Client gallery · Gabby</p>
          <h2>Your finals,<br />ready to keep.</h2>
        </div>
        <div className={styles.introCopy}>
          <p>
            Every photograph below is part of your final delivered set. Tap any image to view it larger,
            then use the download control to save the high-quality delivery file.
          </p>
          <div className={styles.deliveryMeta}>
            <span><b>28</b> photographs</span>
            <span><b>3600px</b> delivery files</span>
            <span><b>1</b> complete ZIP</span>
          </div>
        </div>
      </section>

      <GabbyGallery photos={photos} />

      <section className={styles.downloadSection}>
        <p className={styles.kicker}>Everything in one place</p>
        <h2>Take the whole<br />gallery with you.</h2>
        <a className={styles.bigDownload} href="/client/gabby/Gabby-Final-Gallery.zip" download>
          <span>Download all 28 photos</span>
          <span className={styles.downloadArrow} aria-hidden>↓</span>
        </a>
        <p className={styles.downloadNote}>High-quality 3600px JPEG delivery set · approximately 38 MB</p>
      </section>

      <footer className={styles.footer}>
        <a className={styles.footerBrand} href="https://www.denzeltinashe.com">Denzel Tinashe</a>
        <p>Photography · creative direction · digital work</p>
        <span>Client delivery</span>
      </footer>
    </main>
  );
}
