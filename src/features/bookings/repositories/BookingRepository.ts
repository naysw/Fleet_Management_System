import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AdditionalServiceItem } from "@prisma/client";
import { IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";
import { registerInclude } from "src/utils/queryBuilder";
import { CreateBookingBodyInput } from "../input/CreateBookingBodyInput";
import { FindOneBookingQueryInput } from "../input/FindOneBookingQueryInput";

@Injectable()
export class BookingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * create one booking
   *
   * @param param0 CreateBookingBodyInput
   * @returns
   */
  async create(
    {
      vehicleId,
      parkingSlotId,
      customerId,
      from,
      to,
      duration,
      notes,
      additionalServiceItems,
    }: Omit<CreateBookingBodyInput, "additionalServiceItems"> & {
      additionalServiceItems: Partial<AdditionalServiceItem>[];
    },
    { include }: FindOneBookingQueryInput,
  ) {
    console.log("additionalServiceItems", additionalServiceItems);

    try {
      return await this.prismaService.booking.create({
        data: {
          customer: customerId
            ? {
                connect: {
                  id: customerId,
                },
              }
            : undefined,
          vehicle: vehicleId
            ? {
                connect: {
                  id: vehicleId,
                },
              }
            : undefined,
          parkingSlot: parkingSlotId
            ? {
                connect: {
                  id: parkingSlotId,
                },
              }
            : undefined,
          from,
          to,
          duration,
          notes,
          additionalServiceItems:
            additionalServiceItems && additionalServiceItems.length > 0
              ? {
                  create: additionalServiceItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    discount: item.discount,
                  })),
                }
              : undefined,
        },
        include: {
          additionalServiceItems: registerInclude(
            include,
            "additionalServiceItems",
          ),
          customer: registerInclude(include, "customer"),
          vehicle: registerInclude(include, "vehicle"),
          parkingSlot: registerInclude(include, "parkingSlot"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? JSON.stringify(error) : "create booking failed",
      );
    }
  }

  /**
   * find by id
   *
   * @param id string
   * @returns
   */
  async findById(id: string) {
    try {
      return await this.prismaService.booking.findUnique({
        where: {
          id,
        },
        include: {
          additionalServiceItems: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(IS_DEV ? error : "findById error");
    }
  }
}
