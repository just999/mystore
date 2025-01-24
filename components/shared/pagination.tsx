'use client';

import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParam?: string;
};

const Pagination = ({ page, totalPages, urlParam }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (totalPages <= 0) return null;

  const handleClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParam || 'page',
      value: pageValue.toString(),
    });
    router.push(newUrl);
  };

  return (
    <div className='flex gap-2'>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        Previous
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) >= Number(totalPages)}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
