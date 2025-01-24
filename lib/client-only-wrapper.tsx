'use client';

import { useEffect, useState } from 'react';

type ClientOnlyWrapperProps = {
  children: React.ReactNode;
};

const ClientOnlyWrapper = ({ children }: ClientOnlyWrapperProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnlyWrapper;
