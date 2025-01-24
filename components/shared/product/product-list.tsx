import { Product } from '@prisma/client';
import ProductCard from './product-card';

type ProductListProps = {
  data: Product[];
  title?: string;
  limit?: number;
};

const ProductList = ({ data, title, limit }: ProductListProps) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-4'>{title}</h2>
      {data.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {limitedData.map((pro) => (
            <ProductCard product={pro} key={pro.slug} />
          ))}
        </div>
      ) : (
        <div>
          <p>No Product found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
