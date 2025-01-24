'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import { Product } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

type ProductCarouselProps = {
  data: Product[];
};

const ProductCarousel = ({ data }: ProductCarouselProps) => {
  return (
    <Carousel
      className='mb-12 w-full'
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((prod: Product) => (
          <CarouselItem key={prod.id}>
            <Link href={`/product/${prod.slug}`}>
              <div className='relative mx-auto'>
                <Image
                  src={prod.banner!}
                  alt={prod.name}
                  height='0'
                  width='0'
                  sizes='100vw'
                  className='h-auto w-full'
                />
                <div className='absolute inset-0 flex items-end justify-center'>
                  <h2 className='bg-gray-900 bg-opacity-50 px-2 text-2xl font-bold text-white'>
                    {prod.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;
