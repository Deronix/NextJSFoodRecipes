import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import ContentGrid from '../../../components/content/ContentGrid';
import { getContentList } from '../../../lib/db';

export const metadata = {
  title: 'Articles - Global Food Hub',
  description: 'Learn about nutrition, cooking tips, and food culture',
};

export default async function ArticlesPage({ params }) {
  const { locale } = params;
  
  // Fetch articles
  const articles = await getContentList('article', null, locale);
  
  return (
    <main>
      <Navbar locale={locale} />
      
      <div className="container-default py-12">
        <header className="mb-10">
          <h1 className="heading-1 mb-4">Articles</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Learn about nutrition, cooking tips, and food culture
          </p>
        </header>
        
        <ContentGrid content={articles} locale={locale} />
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}