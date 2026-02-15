import '@/styles/fonts.css';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Software Designer, Creative Technologist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
