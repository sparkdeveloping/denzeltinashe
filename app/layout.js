import './globals.css';

export const metadata = {
  metadataBase: new URL('https://denzeltinashe.com'),
  title: {
    default: 'Denzel Tinashe — Product Designer & Engineer',
    template: '%s — Denzel Tinashe',
  },
  description:
    'Denzel Tinashe designs and engineers native iOS apps, full-stack web products, and high-conviction websites from product definition through launch.',
  keywords: [
    'product designer',
    'software engineer',
    'iOS developer',
    'SwiftUI developer',
    'Next.js developer',
    'app developer',
    'web app developer',
  ],
  openGraph: {
    title: 'Denzel Tinashe — Product Designer & Engineer',
    description: 'Apps, web products, and websites—from the first product decision to launch-quality code.',
    type: 'website',
    url: 'https://denzeltinashe.com',
    images: ['/portrait-2026.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Denzel Tinashe — Product Designer & Engineer',
    description: 'Apps, web products, and websites—from the first product decision to launch-quality code.',
    images: ['/portrait-2026.webp'],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
