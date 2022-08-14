import prisma from '../../lib/prisma';
import customerSeeder from './customerSeeder';
import serviceSeeder from './serviceSeeder';

(async () => {
  await serviceSeeder();
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
