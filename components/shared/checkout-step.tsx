'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type CheckoutStepProps = {
  current?: number;
};

const CheckoutStep = ({ current = 0 }: CheckoutStepProps) => {
  return (
    <div className='flex-between mb-10 flex-col space-x-2 space-y-2 md:flex-row'>
      {['User Login', 'Shipping Address', 'Payment Method', 'PlaceOrder'].map(
        (step, i) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                'w-56 rounded-full p-2 text-center text-sm',
                i === current ? 'bg-secondary' : ''
              )}
            >
              {step}
            </div>
            {step !== 'Place Order' && (
              <hr className='mx-2 w-16 border-t border-r-gray-300' />
            )}
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default CheckoutStep;
