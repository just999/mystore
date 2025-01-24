import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/actions/product-actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';

type HomePageProps = unknown;

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  // await delay(9000);

  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='New Arrival' limit={4} />
      <ViewAllProductsButton />
    </>
  );
};

export default HomePage;
