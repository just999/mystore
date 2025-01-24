// 'use client';

// import { Button } from '@/components/ui/button';
// import { Loader, TriangleAlert, Undo2 } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// import { Suspense } from 'react';

// const NotFoundPage = () => {
//   const router = useRouter();
//   return (
//     <div className='flex h-full flex-row items-center justify-center'>
//       <div className='flex w-full flex-col items-center justify-center'>
//         <div className='icon'>
//           <TriangleAlert size={50} className='svg text-rose-600' />
//         </div>
//         <div className='news text-3xl'>Page Not Found!</div>
//         <Link
//           href='/'
//           className='mt-10 flex cursor-pointer flex-row items-center rounded-md bg-sky-50 px-3 py-2 text-3xl hover:bg-sky-50/40 hover:text-blue-600'
//         >
//           <Suspense fallback={<Loader className='animate-spin' />}>
//             <Button
//               variant='outline'
//               className='ml-2 mt-4'
//               onClick={() => router.back()}
//             >
//               <Undo2 className='svg' /> Back to Main Page
//             </Button>
//           </Suspense>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default NotFoundPage;

'use client';

type NotFoundProps = unknown;

const NotFound = () => {
  return <div>NotFound</div>;
};

export default NotFound;
