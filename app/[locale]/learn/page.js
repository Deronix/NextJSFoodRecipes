import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import ContentGrid from '../../../components/content/ContentGrid';
import { getContentList } from '../../../lib/db';

export const metadata = {
  title: 'Learn - Global Food Hub',
  description: 'Educational content to improve your cooking skills',
};

export default async function LearnPage({ params }) {
  const { locale } = params;
  
  // Fetch educational content
  const educational = await getContentList('educational', null, locale);
  
  return (
    <main>
      <Navbar locale={locale} />
      
      <div className="container-default py-12">
        <header className="mb-10">
          <h1 className="heading-1 mb-4">Learn</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Educational content to improve your cooking skills
          </p>
        </header>
        
        <ContentGrid content={educational} locale={locale} />
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}   