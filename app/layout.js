import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://denzeltinashe.com'),
  title: 'Denzel Tinashe — Product Designer & Developer',
  description:
    'Denzel Tinashe designs and builds polished mobile apps, web apps, and high-conviction websites from product idea through launch.',
  openGraph: {
    title: 'Denzel Tinashe — Product Designer & Developer',
    description: 'Mobile apps, web apps, and websites — designed and built from idea to launch.',
    type: 'website',
    url: 'https://denzeltinashe.com',
    images: ['/portrait-2026.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Denzel Tinashe — Product Designer & Developer',
    description: 'Mobile apps, web apps, and websites — designed and built from idea to launch.',
    images: ['/portrait-2026.webp'],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
