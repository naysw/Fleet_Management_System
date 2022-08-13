import prisma from '../../lib/prisma';
import customerSeeder from './customerSeeder';

(async () => {
  await customerSeeder();
})()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding complete');
    await prisma.$disconnect();
  });
