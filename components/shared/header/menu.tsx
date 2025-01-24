import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButtonWrapper from '@/components/user-button-wrapper';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import DarkModeToggle from './dark-mode-toggle';

type MenuProps = unknown;

const Menu = () => {
  return (
    <div className='flex justify-end gap-3'>
      <nav className='hidden w-full max-w-xs gap-1 md:flex'>
        <DarkModeToggle />
        <Button asChild variant='ghost'>
          <Link href='/cart' className='flex items-center gap-2'>
            <ShoppingCart size={20} /> <span>Cart</span>
          </Link>
        </Button>
        <UserButtonWrapper />
      </nav>

      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle' asChild>
            <Button variant='ghost' size='icon'>
              <EllipsisVertical />
            </Button>
          </SheetTrigger>
          <SheetContent className='flex w-[300px] flex-col items-start'>
            <SheetTitle>Menu</SheetTitle>

            <div className='flex flex-col gap-2'>
              <DarkModeToggle />
              <Button asChild variant='ghost'>
                <Link href='/cart' className='flex items-center gap-2'>
                  <ShoppingCart size={20} /> <span>Cart</span>
                </Link>
              </Button>
              <UserButtonWrapper />
            </div>

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
