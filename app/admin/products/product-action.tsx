'use client';

import { deleteProduct } from '@/actions/product-actions';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@prisma/client';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

type ProductActionProps = {
  data: Product;
};

const ProductAction = ({ data }: ProductActionProps) => {
  return (
    <div className='flex items-center'>
      <Button
        asChild
        variant='link'
        size='sm'
        className='dark:border dark:border-gray-800'
      >
        <Link href={`/admin/products/${data.id}`}>
          <Pencil /> Edit
        </Link>
      </Button>
      <DeleteDialog id={data.id} action={deleteProduct} />
    </div>
  );
};

export default ProductAction;
