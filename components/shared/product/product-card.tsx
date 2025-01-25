import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import ProductPrice from './product-price';
import Rating from './rating';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='items-center p-0'>
        <CardTitle>
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
              className='h-[300px] w-[300px]'
            />
          </Link>
        </CardTitle>
        {/* <CardDescription className='p-0'>{product.slug}</CardDescription> */}
      </CardHeader>
      <CardContent className='grid gap-4 p-4 text-xs'>
        <div>{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-sm font-medium'>{product.name}</h2>
        </Link>

        <div className='flex-between flex gap-4'>
          {/* <p>{product.rating} Stars</p> */}
          <Rating value={Number(product.rating)} />
          {Number(product.stock) > 0 ? (
            <ProductPrice value={Number(product.price)} className=' ' />
          ) : (
            <p className='text-destructive'>Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
