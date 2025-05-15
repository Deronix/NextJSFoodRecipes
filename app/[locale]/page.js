import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Hero from '../../components/common/Hero';
import ContentGrid from '../../components/content/ContentGrid';
import CategoryList from '../../components/content/CategoryList';
import { getPopularContent, getCategories } from '../../lib/db';
import { getLanguageIdByCode } from '../../lib/i18n';

export const metadata = {
  title: 'Global Food Hub - Home',
  description: 'Explore recipes, cooking tips, and food knowledge from around the world',
};

export default async function LocaleHomePage({ params }) {
  const { locale } = params;
  const languageId = getLanguageIdByCode(locale);
  
  // Fetch content for homepage
  const popularContent = await getPopularContent(8, locale);
  const categories = await getCategories(locale);
  
  return (
    <main>
      <Navbar locale={locale} />
      
      <Hero locale={locale} />
      
      <div className="container-default py-12">
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Popular Content</h2>
          <ContentGrid content={popularContent} locale={locale} />
        </section>
        
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Explore Categories</h2>
          <CategoryList categories={categories} locale={locale} />
        </section>
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}