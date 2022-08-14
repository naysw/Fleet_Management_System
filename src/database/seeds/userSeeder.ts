import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";
import prisma from "../../lib/prisma";

export default async function userSeeder(length: number = 10) {
  Array.from({ length }).forEach(async () => {
    await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashSync("password", 15),
      },
    });
  });
}
