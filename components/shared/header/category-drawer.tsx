import { getAllCategories } from '@/actions/product-actions';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

type CategoryDrawerProps = unknown;

const CategoryDrawer = async () => {
  const categories = await getAllCategories();
  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-sm'>
        <DrawerHeader>
          <DrawerTitle>Select a Category</DrawerTitle>
          <div className='mt-4 space-y-1'>
            {categories.map((cat) => (
              <Button
                variant='ghost'
                className='w-full justify-start'
                key={cat.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${cat.category}`}>
                    {cat.category} ({cat._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
