import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma";

export default async function customerSeeder(length: number = 10) {
  Array.from({ length }).forEach(async () => {
    await prisma.customer.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.address.streetAddress(),
        vehicles: {
          create: [
            {
              plateNumber: faker.random.alphaNumeric(7),
              description: faker.lorem.sentence(),
            },
          ],
        },
      },
    });
  });
}
