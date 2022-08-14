import prisma from "../../lib/prisma";
import { roles } from "../../_data/roles";

export default async function roleSeeder() {
  for (const { id, name } of roles) {
    await prisma.role.create({
      data: {
        id,
        name,
      },
    });
  }
}
