import { RadarIcon } from 'lucide-react';

type LoadingPageProps = unknown;

const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
      className='flex flex-col'
    >
      {/* <Image src={loader} width={150} height={150} alt='loading' /> */}
      <RadarIcon
        size={150}
        className='light:text-stone-500 block animate-spin stroke-1 dark:text-slate-500'
      />
      <span className='animate-pulse dark:text-slate-500'>Loading...</span>
    </div>
  );
};

export default LoadingPage;
