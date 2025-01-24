import { getProductById } from '@/actions/product-actions';
import ProductForm from '@/components/admin/product-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update product ',
};

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const AdminProductDetailPage = async ({
  params,
}: AdminProductDetailPageProps) => {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product) return notFound();

  return (
    <div className='mx-auto max-w-5xl space-y-8'>
      <h1 className='h2-bold'>Update Product</h1>
      <ProductForm type='Update' product={product} productId={product.id} />
    </div>
  );
};

export default AdminProductDetailPage;
