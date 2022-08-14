import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Service } from '@prisma/client';
import { DEFAULT_TAKE, IS_DEV } from 'src/config/constants';
import { PrismaService } from 'src/services/PrismaService';
import { registerInclude, registerOrderBy } from 'src/utils/queryBuilder';
import { CreateServiceBodyInput } from '../input/CreateServiceBodyInput';
import { FindManyServiceQueryInput } from '../input/FindManyServiceQueryInput';

@Injectable()
export class ServiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({
    take,
    skip,
    filter,
    include,
    orderBy,
    sort,
    select,
  }: FindManyServiceQueryInput): Promise<Service[]> {
    try {
      return await this.prismaService.service.findMany({
        take: Number(take) || DEFAULT_TAKE,
        skip: Number(skip) || undefined,
        orderBy: registerOrderBy(orderBy),
        include: {
          bookings: registerInclude(include, 'bookings'),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : 'findMany services error',
      );
    }
  }

  async createService({ name, price, description }: CreateServiceBodyInput) {
    try {
      return await this.prismaService.service.create({
        data: {
          name,
          price,
          description,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : 'create service error',
      );
    }
  }
}
