import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '3D Orderbook Visualizer | Advanced Trading Analytics',
  description: 'Real-time 3D visualization of cryptocurrency orderbook depth with pressure zone analysis and multi-venue support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}