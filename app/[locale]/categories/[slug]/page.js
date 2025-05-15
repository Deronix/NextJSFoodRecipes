import Navbar from '../../../../components/common/Navbar';
import Footer from '../../../../components/common/Footer';
import ContentGrid from '../../../../components/content/ContentGrid';
import { getCategoryBySlug, getContentList } from '../../../../lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const category = await getCategoryBySlug(slug, locale);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found',
    };
  }
  
  return {
    title: `${category.name} - Global Food Hub`,
    description: category.description || `Browse ${category.name} content`,
  };
}

export default async function CategoryPage({ params }) {
  const { locale, slug } = params;
  
  // Fetch category details
  const category = await getCategoryBySlug(slug, locale);
  
  // If category doesn't exist, return 404
  if (!category) {
    notFound();
  }
  
  // Fetch content for this category
  const content = await getContentList(null, category.id, locale);
  
  return (
    <main>
      <Navbar locale={locale} />
      
      <div className="container-default py-12">
        <header className="mb-10">
          <h1 className="heading-1 mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {category.description}
            </p>
          )}
        </header>
        
        {content.length > 0 ? (
          <ContentGrid content={content} locale={locale} />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No content available in this category yet.
            </p>
          </div>
        )}
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}