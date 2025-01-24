import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

async function main() {
  const prisma = new PrismaClient();

  await db.product.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.verificationToken.deleteMany();
  await db.user.deleteMany();

  await db.product.createMany({
    data: { ...sampleData.products },
  });
  await db.user.createMany({
    data: sampleData.users,
  });
}

main();
