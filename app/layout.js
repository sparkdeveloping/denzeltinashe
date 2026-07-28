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
  title: 'Denzel Tinashe — Ministry, Media & Web/Mobile Apps',
  description:
    'Denzel Tinashe builds ministry platforms, media systems, websites, and mobile products with conviction and disciplined excellence.',
  openGraph: {
    title: 'Denzel Tinashe — Ministry, Media & Web/Mobile Apps',
    description: 'Ministry. Media. Web and mobile products.',
    type: 'website',
    url: 'https://denzeltinashe.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
