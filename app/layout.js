import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.denzeltinashe.com'),
  title: { default: 'Denzel Tinashe — Product Designer & Engineer', template: '%s — Denzel Tinashe' },
  description: 'Denzel Tinashe designs and engineers native iOS apps, full-stack web products, and high-conviction websites from product definition through launch.',
  keywords: ['product designer','software engineer','design engineer','iOS developer','SwiftUI developer','Next.js developer','app developer','web app developer'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Denzel Tinashe — Product Designer & Engineer',
    description: 'Product thinking, interface craft, and launch-quality code across native iOS and the web.',
    type: 'website', url: 'https://www.denzeltinashe.com', siteName: 'Denzel Tinashe', images: ['/og/home.png'],
  },
  twitter: { card: 'summary_large_image', title: 'Denzel Tinashe — Product Designer & Engineer', description: 'Product thinking, interface craft, and launch-quality code across native iOS and the web.', images: ['/og/home.png'] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
