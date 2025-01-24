import AdminSearch from '@/components/admin/admin-search';
import Menu from '@/components/shared/header/menu';
import Image from 'next/image';
import Link from 'next/link';
import MainNav from './main-nav';

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='container mx-auto border-b'>
          <div className='flex h-16 items-center px-4'>
            <Link href='/' className='w-22'>
              <Image src='/images/log.svg' alt='logo' width={48} height={48} />
            </Link>
            <MainNav className='mx-6' />
            <div className='ml-auto flex items-center space-x-4'>
              <AdminSearch />
              <Menu />
            </div>
          </div>
        </div>
        <div className='container mx-auto flex-1 space-y-4 p-8 pt-6'>
          {children}
        </div>
      </div>
    </>
  );
}
