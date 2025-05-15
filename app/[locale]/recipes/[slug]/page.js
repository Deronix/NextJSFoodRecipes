import Navbar from '../../../../components/common/Navbar';
import Footer from '../../../../components/common/Footer';
import RecipeDetails from '../../../../components/content/RecipeDetails';
import ContentGrid from '../../../../components/content/ContentGrid';
import { getContentBySlug, getRecipeDetails, getRelatedContent } from '../../../../lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const content = await getContentBySlug(slug, locale);
  
  if (!content) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found',
    };
  }
  
  return {
    title: `${content.title} - Global Food Hub`,
    description: content.summary || 'Explore this delicious recipe',
  };
}

export default async function RecipePage({ params }) {
  const { locale, slug } = params;
  
  // Fetch recipe content
  const content = await getContentBySlug(slug, locale);
  
  // If content doesn't exist or isn't a recipe, return 404
  if (!content || content.type !== 'recipe') {
    notFound();
  }
  
  // Fetch recipe specific details (ingredients & instructions)
  const recipeDetails = await getRecipeDetails(content.id, locale);
  
  // Fetch related content
  const relatedContent = await getRelatedContent(content.id, content.category_id, 3, locale);
  
  return (
    <main>
      <Navbar locale={locale} />
      
      <div className="container-default py-12">
        <RecipeDetails 
          content={content} 
          ingredients={recipeDetails.ingredients}
          instructions={recipeDetails.instructions}
          locale={locale}
        />
        
        {relatedContent.length > 0 && (
          <section className="mt-16">
            <h2 className="heading-2 mb-6">You Might Also Like</h2>
            <ContentGrid content={relatedContent} locale={locale} />
          </section>
        )}
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}