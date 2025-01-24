import { getAllProducts } from '@/actions/product-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductTable from './product-table';

type AdminProductsPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
  }>;
};

const AdminProductsPage = async ({ searchParams }: AdminProductsPageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const searchText = params.query || '';
  const category = params.category || '';
  const price = params.price || '';
  const rating = params.rating || '';

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
    limit: 12,
    price,
    rating,
  });
  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Products</h1>
          {searchText && (
            <div className='flex w-full items-center gap-4'>
              <span>
                Filtered by <i>&quot;{searchText}&quot;</i>
              </span>
              <Link href='/admin/products'>
                <Button variant='outline' size='sm'>
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild>
          <Link href='/admin/products/create'>Create Product</Link>
        </Button>
      </div>
      <ProductTable
        products={products}
        totalPages={products.totalPages}
        page={page}
      />
    </div>
  );
};

export default AdminProductsPage;
