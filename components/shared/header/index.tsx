import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import CategoryDrawer from './category-drawer';
import Menu from './menu';
import Search from './search';

type HeaderProps = unknown;

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <CategoryDrawer />
          <Link href='/' className='flex-start ml-4'>
            <Image
              src='/images/log.svg'
              alt={`${APP_NAME} logo`}
              width={28}
              height={28}
              priority={true}
            />
            <span className='ml-3 hidden text-2xl font-bold lg:block'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='hidden md:block'>
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
