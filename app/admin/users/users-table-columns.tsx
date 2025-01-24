import { Badge } from '@/components/ui';
import { formatId } from '@/lib/utils';
import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import UsersAction from './users-action';

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'index',
    header: 'No.',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => <div>{formatId(row.original.id)}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) =>
      row.original.role === 'USER' ? (
        <Badge variant='secondary' className='bg-emerald-600/40'>
          User
        </Badge>
      ) : (
        <Badge variant='outline' className='bg-sky-600/40'>
          Admin
        </Badge>
      ),
  },
  {
    id: 'action',
    header: 'action',
    cell: ({ row }) => <UsersAction data={row.original} />,
  },
];
