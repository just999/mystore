import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

// Base Input Props
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
  isDirty?: boolean;
  suffix?: React.ReactNode;
}

// Base Input Component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, suffix, type, isInvalid, isDirty, errorMessage, ...props },
    ref
  ) => {
    return (
      <>
        <div className={cn('relative flex w-full items-center')}>
          <input
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix}
        </div>
        {isInvalid && errorMessage && (
          <span
            className={cn(
              'error-message text-shadow rounded-sm bg-fuchsia-100 px-4 text-xs text-red-700'
            )}
          >
            {errorMessage}
          </span>
        )}
      </>
    );
  }
);
Input.displayName = 'Input';

// Password Input Component
const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    const passwordSuffix = show ? (
      <EyeIcon
        size={18}
        className='absolute right-2 cursor-pointer select-none text-zinc-400 hover:text-stone-600'
        onClick={() => setShow(false)}
      />
    ) : (
      <EyeOffIcon
        size={18}
        className='absolute right-2 cursor-pointer select-none text-zinc-400 hover:text-stone-600'
        onClick={() => setShow(true)}
      />
    );

    return (
      <Input
        type={show ? 'text' : 'password'}
        suffix={passwordSuffix}
        className={cn('relative', className)}
        {...props}
        ref={ref}
      />
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

// Export both components
export { Input, PasswordInput };
