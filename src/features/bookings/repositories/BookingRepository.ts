import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IS_DEV } from 'src/config/constants';
import { PrismaService } from 'src/services/PrismaService';
import { registerInclude } from 'src/utils/queryBuilder';
import { CreateBookingBodyInput } from '../input/CreateCustomerBodyInput';
import { FindOneBookingQueryInput } from '../input/FindOneBookingQueryInput';

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
      carNumber,
      customerId,
      from,
      to,
      notes,
      serviceIds,
    }: CreateBookingBodyInput,
    { include }: FindOneBookingQueryInput,
  ) {
    try {
      return await this.prismaService.booking.create({
        data: {
          carNumber,
          customer: customerId
            ? {
                connect: {
                  id: customerId,
                },
              }
            : undefined,
          from,
          to,
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
          services: registerInclude(include, 'services')
            ? { select: { service: true } }
            : false,
          customer: registerInclude(include, 'customer'),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : 'create booking failed',
      );
    }
  }
}
