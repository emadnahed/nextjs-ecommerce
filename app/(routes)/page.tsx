import CarouselFeatured from "@/components/CarouselFeatured";
import Footer from "@/components/footer";
import TitleHeader from "@/components/title-header";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import { getAllProducts } from "@/lib/apiCalls";
import { Product } from "@/types";

const HomePage = async () => {
  const products = await getAllProducts();

  const featuredProducts = products.filter(
    (product: Product) => product.featured
  );

  return (
    <>
      <Container>
        <Billboard />
      </Container>
      <div className="mt-12 mb-24">
        <TitleHeader title="Featured Products" url="/featured" />
        {featuredProducts.length > 0 && (
          <CarouselFeatured data={featuredProducts} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
