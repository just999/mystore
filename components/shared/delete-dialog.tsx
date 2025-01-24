'use client';

import { useToast } from '@/hooks/use-toast';
import { LoaderIcon, TriangleAlert } from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

type DeleteDialogProps = {
  id: string;
  action: (id: string) => Promise<{ error: boolean; message: string }>;
};

const DeleteDialog = ({ id, action }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);

      if (res.error) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        setOpen(false);
        toast({
          description: res.message,
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size='sm' variant='destructive' className='ml-2'>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='flex flex-col items-center justify-center'>
          <AlertDialogTitle className='flex items-center gap-2'>
            <TriangleAlert size='20' className='animate-pulse text-pink-600' />{' '}
            Are You fucking sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be fucking undone!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <AlertDialogFooter>
          <span className='flex w-full items-center justify-center gap-4'>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              size='sm'
              disabled={isPending}
              onClick={handleDeleteClick}
            >
              {isPending ? <LoaderIcon className='animate-spin' /> : 'Delete'}
            </Button>
          </span>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
