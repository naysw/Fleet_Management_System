import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";
import prisma from "../../lib/prisma";
import { ADMIN_ROLE_ID } from "../../_data/roles";

export default async function userSeeder(length: number = 10) {
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@admin.com",
      username: "admin",
      password: hashSync("password", 10),
      roles: {
        create: {
          role: {
            connect: {
              id: ADMIN_ROLE_ID,
            },
          },
        },
      },
    },
  });

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
