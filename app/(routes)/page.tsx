import CarouselFeatured from "@/components/CarouselFeatured";
import CategoryGrid from "@/components/CategoryGrid";
import ImageCarousel from "@/components/ImageCarousel";
import Footer from "@/components/footer";
import TitleHeader from "@/components/title-header";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import { getFeaturedProductsFromDB, getWomenProductsFromDB, getTopLevelCategoriesFromDB } from "@/lib/serverDataAccess";

const HomePage = async () => {
  console.log('[HomePage] Fetching featured products...');
  const featuredProducts = await getFeaturedProductsFromDB();
  const womenProducts = await getWomenProductsFromDB();
  const topLevelCategories = await getTopLevelCategoriesFromDB();


  return (
    <>
      {topLevelCategories.length > 0 && (
        <CategoryGrid categories={topLevelCategories} />
      )}
      <Container>
        <Billboard />
      </Container>

      <div className="mt-12 mb-24">
        <TitleHeader title="Featured Products" url="/featured" />
        {featuredProducts.length > 0 && (
          <CarouselFeatured data={featuredProducts} />
        )}
      </div>
      <div className="mb-24">
        <TitleHeader title="Women's Fashion" url="/shop?topLevelCategory=Women Western" />
        {womenProducts.length > 0 && (
          <CarouselFeatured data={womenProducts} />
        )}
      </div>
      <div className="mt-12 mb-24">
        <TitleHeader title="Special Offers" />
        <ImageCarousel />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
