import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MAHI — THE LEGACY | Mahendra Singh Dhoni',
  description: 'An extraordinary cinematic interactive documentary website celebrating MS Dhoni — The Man, The Captain, The Legend.',
  keywords: ['MS Dhoni', 'Mahi', 'Thala', 'Chennai Super Kings', 'Cricket World Cup', 'Indian Cricket', 'The Legend of Mahi'],
  authors: [{ name: 'Mahi Legacy Tribute' }],
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-white selection:bg-[#D4AF66] selection:text-black">
        {children}
      </body>
    </html>
  );
}
