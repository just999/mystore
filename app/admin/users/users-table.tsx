'use client';

import { DataTable } from '@/components/data-table';
import { User } from '@prisma/client';
import { usersColumns } from './users-table-columns';

type UsersTableProps = {
  users: User[];
  totalPages?: number;
  page?: number;
};

const UsersTable = ({ users, totalPages, page }: UsersTableProps) => {
  return (
    <DataTable
      data={users}
      columns={usersColumns}
      totalPages={totalPages}
      page={page}
    />
  );
};

export default UsersTable;
