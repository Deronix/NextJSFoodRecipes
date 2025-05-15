import { redirect } from 'next/navigation';
import { getDefaultLanguage } from '../lib/i18n';

export default function Home() {
  const defaultLanguage = getDefaultLanguage();
  redirect(`/${defaultLanguage}`);
};