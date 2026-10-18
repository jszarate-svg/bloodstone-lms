import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bloodstone LMS',
  description: 'Bagonbon NHS Class Management & Student Grade Inquiry System',
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
