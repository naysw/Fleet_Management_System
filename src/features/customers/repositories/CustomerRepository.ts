import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_TAKE, IS_DEV } from 'src/config/constants';
import { PrismaService } from 'src/services/PrismaService';
import { includeRelationship, orderByField } from 'src/utils/queryBuilder';
import { CreateCustomerBodyInput } from '../input/CreateCustomerBodyInput';
import { FindManyCustomerQueryInput } from '../input/FindManyCustomerQueryInput';
import { FindOneCustomerQueryInput } from '../input/FindOneCustomerQueryInput';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * find many customers
   *
   * @param param0 FindManyCustomerQueryInput
   * @returns
   */
  async findMany({
    take,
    skip,
    filter,
    include,
    orderBy,
    sort,
    select,
  }: FindManyCustomerQueryInput): Promise<any> {
    try {
      return await this.prismaService.customer.findMany({
        include: {
          bookings: includeRelationship(include, 'bookings'),
        },
        skip: Number(skip) || undefined,
        take: Number(take) || DEFAULT_TAKE,
        orderBy: orderByField(orderBy),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : 'findMany customers error',
      );
    }
  }

  /**
   * create customer
   *
   * @param param0 CreateCustomerBodyInput
   * @returns
   */
  async createCustomer(
    { firstName, lastName, email, phone, address }: CreateCustomerBodyInput,
    { include }: FindOneCustomerQueryInput,
  ) {
    try {
      return await this.prismaService.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
        },
        include: {
          bookings: includeRelationship(include, 'bookings'),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : 'create customer error',
      );
    }
  }

  /**
   * find customer by email
   *
   * @param email string
   * @returns
   */
  async isCustomerExists(email: string) {
    try {
      return await this.prismaService.customer.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : 'findOrFailByEmail error',
      );
    }
  }
}
