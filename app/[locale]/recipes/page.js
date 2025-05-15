import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import ContentGrid from '../../../components/content/ContentGrid';
import { getContentList } from '../../../lib/db';

export const metadata = {
  title: 'Recipes - Global Food Hub',
  description: 'Explore delicious recipes from around the world',
};

export default async function RecipesPage({ params }) {
  const { locale } = params;
  
  // Fetch recipes
  const recipes = await getContentList('recipe', null, locale);
  
  return (
    <main>
      <Navbar locale={locale} />
      
      <div className="container-default py-12">
        <header className="mb-10">
          <h1 className="heading-1 mb-4">Recipes</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover delicious recipes to cook at home
          </p>
        </header>
        
        <ContentGrid content={recipes} locale={locale} />
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}