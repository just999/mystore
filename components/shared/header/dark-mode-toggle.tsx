'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/lib/contexts/theme-context';
import { Laptop2, Moon, Sun } from 'lucide-react';

// type DarkModeToggleProps = {
//   defaultMode?: Theme;
//   className?: string;
// };

const DarkModeToggle = () => {
  // const { theme, toggleTheme } = useDarkMode({ defaultTheme: defaultMode });
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          {resolvedTheme === 'dark' ? (
            <Moon className='h-[1.2rem] w-[1.2rem]' />
          ) : (
            <Sun className='h-[1.2rem] w-[1.2rem]' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='text-xs'>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === 'system'}
          onClick={() => setTheme('system')}
        >
          <Laptop2 className='mr-2 h-4 w-4' />
          <span className='text-xs'>System</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === 'dark'}
          onClick={() => setTheme('dark')}
        >
          <Moon className='mr-2 h-4 w-4' />
          <span className='text-xs'>Dark</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === 'light'}
          onClick={() => setTheme('light')}
        >
          <Sun className='mr-2 h-4 w-4' />
          <span className='text-xs'>Light</span>
        </DropdownMenuCheckboxItem>

        {/* <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className='mr-2 h-4 w-4' />
          <span className='text-xs'>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className='mr-2 h-4 w-4' />
          <span className='text-xs'>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop2 className='mr-2 h-4 w-4' />
          <span className='text-xs'>System</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DarkModeToggle;
