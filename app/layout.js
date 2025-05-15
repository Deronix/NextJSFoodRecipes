import { Inter } from 'next/font/google';
import './globals.css';
import { dir } from 'i18next';
import { languages } from '../lib/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Global Food Hub',
  description: 'Discover recipes, cooking tips, and food knowledge from around the world',
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ locale: lng }));
}

export default function RootLayout({ children, params }) {
  const locale = params?.locale || 'en';
  
  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
};