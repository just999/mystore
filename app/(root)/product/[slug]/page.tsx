import { CartResponse, getMyCart } from '@/actions/cart-actions';
import { getProductBySlug } from '@/actions/product-actions';
import { auth } from '@/auth';
import AddToCart from '@/components/shared/product/add-to-cart';
import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import Rating from '@/components/shared/product/rating';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import ReviewList from './review-list';

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { slug } = await params;

  const prod = await getProductBySlug(slug);

  if (!prod) notFound();

  const session = await auth();
  const userId = session?.user.id;

  const cart = (await getMyCart()) as CartResponse | undefined;
  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          <div className='col-span-2'>
            <ProductImages images={prod.images} />
          </div>
          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>
                {prod.brand} {prod.category}
              </p>
              <h1 className='h3-bold'>{prod.name}</h1>
              <Rating value={Number(prod.rating)} />
              <p>{prod.numReviews} reviews</p>
              {/* <p>
                {prod.rating} of {prod.numReviews}
                <span className='pl-2'>
                  {Number(prod.numReviews) > 1 ? 'Reviews' : 'Review'}
                </span>
              </p> */}
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <ProductPrice
                  value={Number(prod.price)}
                  className='w-24 rounded-full bg-emerald-100 px-5 py-2 text-gray-700'
                />
              </div>
            </div>

            <div className='mt-10'>
              <p className='font-semibold'>Description</p>
              <p>{prod.description}</p>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(prod.price)} />
                  </div>
                </div>
                <div className='mb-2 flex justify-between'>
                  <div>Status</div>
                  {Number(prod.stock) > 0 ? (
                    <Badge variant='outline'>In Stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out of Stock</Badge>
                  )}
                </div>
                {Number(prod.stock) > 0 && (
                  <div className='flex-center'>
                    <AddToCart
                      item={{
                        productId: prod.id,
                        name: prod.name,
                        slug: prod.slug,
                        price: prod.price.toString(),
                        qty: '1',
                        image: prod.images[0],
                      }}
                      cart={cart}
                      cartItems={cart?.items}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='mt-10'>
        <h2 className='h2-bold'>Customer Reviews</h2>
        <ReviewList
          userId={userId || ''}
          productId={prod.id}
          productSlug={prod.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailPage;
