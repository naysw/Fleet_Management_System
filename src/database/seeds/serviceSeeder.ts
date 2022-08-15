import prisma from "../../lib/prisma";
import { services } from "../../_data/services";

export default async function serviceSeeder() {
  for (const { id, name, price, description } of services) {
    await prisma.service.create({
      data: {
        id,
        name,
        price,
        description,
      },
    });
  }
}
