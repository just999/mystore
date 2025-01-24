import { getAllCategories, getAllProducts } from '@/actions/product-actions';
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui';
import { prices, ratings, sortOrders } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ''} ${isCategorySet ? `: Category ${category}` : ''} ${isPriceSet ? `: Price ${price}` : ''} ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Product',
    };
  }
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams;

  //*CONSTRUCT FILTER URL*//
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });
  const categories = await getAllCategories();

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        <div className='mb-2 mt-3 text-xl'>Department</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={getFilterUrl({ c: 'all' })}
                className={
                  cn(category === 'all' || category === '') && 'font-bold'
                }
              >
                any
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.category} className='rounded-sm hover:bg-stone-100'>
                <Link
                  className={cn(category === cat.category && 'font-bold')}
                  href={getFilterUrl({ c: cat.category })}
                >
                  {cat.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PRICE LINK */}

        <div className='mb-2 mt-8 text-xl'>Price</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={getFilterUrl({ p: 'all' })}
                className={cn(price === 'all') && 'font-bold'}
              >
                any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value} className='rounded-sm hover:bg-stone-100'>
                <Link
                  className={cn(price === p.value && 'font-bold')}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Rating Links */}

        <div className='mb-2 mt-8 text-xl'>Customer Rating</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={cn(rating === 'all') && 'font-bold'}
              >
                any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r} className='rounded-sm hover:bg-stone-100'>
                <Link
                  className={cn(rating === r.toString() && 'font-bold')}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='space-y-4 md:col-span-4'>
        <div className='flex-between my-4 flex-col md:flex-row'>
          <div className='flex items-center gap-2'>
            <span>{q !== 'all' && q !== '' && 'Query: ' + q}</span>
            <span>
              {category !== 'all' && category !== '' && 'Category: ' + category}
            </span>
            <span>{price !== 'all' && price !== '' && 'Price: ' + price}</span>
            <span>
              {rating !== 'all' &&
                rating !== '' &&
                'Rating: ' + rating + ' star & up'}
            </span>
            &nbsp;
            <span>
              {(q !== 'all' && q !== '') ||
              (category !== 'all' && category !== '') ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button variant={'link'} asChild className='dark:bg-stone-800'>
                  <Link href='/search'>clear</Link>
                </Button>
              ) : null}
            </span>
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={cn('mx-2', sort === s && 'font-bold')}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.data.length === 0 && <div>No Product found</div>}
          {products.data.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
