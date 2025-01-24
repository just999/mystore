'use client';

import { DataTable } from '@/components/data-table';
import { ExtendedProductProps } from '@/types/type';
import { productColumns } from './product-columns';

type ProductTableProps = {
  products: ExtendedProductProps;
  totalPages?: number;
  page?: number;
};

const ProductTable = ({ products, totalPages, page }: ProductTableProps) => {
  return (
    <DataTable
      data={products.data}
      columns={productColumns}
      totalPages={products.totalPages}
      page={page}
    />
  );
};

export default ProductTable;
