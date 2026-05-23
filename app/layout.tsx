import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codorea CRM',
  description: 'Suivi des prospects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full bg-[#F6F9FC] antialiased">{children}</body>
    </html>
  );
}
