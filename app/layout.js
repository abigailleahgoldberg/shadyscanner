import './globals.css';

export const metadata = {
  title: 'Shady Scanner — AI Security Scanner for Websites and APIs',
  description: 'AI-powered security scanning for websites, APIs, and business tools. Find vulnerabilities before attackers do.',
  metadataBase: new URL('https://shadyscanner.com'),
  openGraph: {
    title: 'Shady Scanner — AI Security Scanner for Websites and APIs',
    description: 'AI-powered security scanning for websites, APIs, and business tools. Find vulnerabilities before attackers do.',
    type: 'website',
    url: 'https://shadyscanner.com',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shady Scanner — AI Security Scanner for Websites and APIs',
    description: 'AI-powered security scanning for websites, APIs, and business tools. Find vulnerabilities before attackers do.',
  },
  alternates: {
    canonical: 'https://shadyscanner.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
