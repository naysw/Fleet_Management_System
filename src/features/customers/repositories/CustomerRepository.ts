import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DEFAULT_TAKE, IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";
import { registerInclude, registerOrderBy } from "src/utils/queryBuilder";
import { CreateCustomerBodyInput } from "../input/CreateCustomerBodyInput";
import { FindManyCustomerQueryInput } from "../input/FindManyCustomerQueryInput";
import { FindOneCustomerQueryInput } from "../input/FindOneCustomerQueryInput";
import { UpdateCustomerBodyInput } from "../input/UpdateCustomerBodyInput";

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
          bookings: registerInclude(include, "bookings"),
        },
        skip: Number(skip) || undefined,
        take: Number(take) || DEFAULT_TAKE,
        orderBy: registerOrderBy(orderBy),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findMany customers error",
      );
    }
  }

  /**
   * create customer
   *
   * @param param0 CreateCustomerBodyInput
   * @returns
   */
  async create(
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
          bookings: registerInclude(include, "bookings"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "create customer error",
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
        include: {
          bookings: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findOrFailByEmail error",
      );
    }
  }

  /**
   * find customer by id
   *
   * @param id string
   * @returns
   */
  async findById(id: string) {
    try {
      return await this.prismaService.customer.findUnique({
        where: {
          id,
        },
        include: {
          bookings: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(IS_DEV ? error : "findById error");
    }
  }

  /**
   * update customer by id
   *
   * @param id string
   * @param param1 UpdateCustomerBodyInput
   * @param param2 FindOneCustomerQueryInput
   * @returns Promise<Customer>
   */
  async update(
    id: string,
    { firstName, lastName, email, phone, address }: UpdateCustomerBodyInput,
    { include }: FindOneCustomerQueryInput,
  ) {
    try {
      return await this.prismaService.customer.update({
        where: {
          id,
        },
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
        },
        include: {
          bookings: registerInclude(include, "bookings"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "update customer error",
      );
    }
  }

  /**
   * delete customer by id
   *
   * @param id string
   * @returns
   */
  async delete(id: string) {
    try {
      return await this.prismaService.customer.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "delete customer error",
      );
    }
  }
}
