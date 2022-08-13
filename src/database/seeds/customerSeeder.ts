import { faker } from '@faker-js/faker';
import prisma from '../../lib/prisma';

export default async function customerSeeder() {
  Array.from({ length: 10 }).forEach(async () => {
    await prisma.customer.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.address.streetAddress(),
      },
    });
  });
}
