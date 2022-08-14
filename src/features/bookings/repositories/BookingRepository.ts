import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
  async createOne(
    {
      vehicleId,
      parkingSlotId,
      customerId,
      from,
      to,
      duration,
      notes,
      serviceIds,
    }: CreateBookingBodyInput,
    { include }: FindOneBookingQueryInput,
  ) {
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
          services:
            serviceIds && serviceIds.length > 0
              ? {
                  create: serviceIds.map((serviceId) => ({
                    service: {
                      connect: { id: serviceId },
                    },
                  })),
                }
              : undefined,
        },
        include: {
          services: registerInclude(include, "services")
            ? { select: { service: true } }
            : false,
          customer: registerInclude(include, "customer"),
          vehicle: registerInclude(include, "vehicle"),
          parkingSlot: registerInclude(include, "parkingSlot"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "create booking failed",
      );
    }
  }
}
