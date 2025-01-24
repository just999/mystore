'use client';

import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products';

  const searchParams = useSearchParams();
  console.log('🚀 ~ AdminSearch ~ pathname:', pathname);

  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');
  console.log('🚀 ~ AdminSearch ~ formActionUrl:', formActionUrl);
  console.log('🚀 ~ AdminSearch ~ queryValue:', queryValue);

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  return (
    <form action={formActionUrl} method='GET'>
      <Input
        type='search'
        placeholder='Search...'
        name='query'
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className='md:w-[100px] lg:w-[300px]'
      />
      <Button type='submit' className='sr-only'>
        Search
      </Button>
    </form>
  );
};

export default AdminSearch;
