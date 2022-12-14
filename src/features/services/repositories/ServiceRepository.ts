import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Service } from "@prisma/client";
import { DEFAULT_TAKE, IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";
import { registerOrderBy } from "src/utils/queryBuilder";
import { CreateServiceBodyInput } from "../input/CreateServiceBodyInput";
import { FindManyServiceQueryInput } from "../input/FindManyServiceQueryInput";
import { UpdateServiceBodyInput } from "../input/UpdateServiceBodyInput";

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
        // include: {
        //   additionalServiceItems: registerInclude(include, "bookings"),
        // },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findMany services error",
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.prismaService.service.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findById service error",
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
        IS_DEV ? error : "create service error",
      );
    }
  }

  async updateService(
    id: string,
    { name, price, description }: UpdateServiceBodyInput,
  ) {
    try {
      return await this.prismaService.service.update({
        where: {
          id,
        },
        data: {
          name,
          price,
          description,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "update service error",
      );
    }
  }

  async deleteService(id: string) {
    try {
      return await this.prismaService.service.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : `Error deleting service with id ${id}`,
      );
    }
  }

  /**
   * get basic hardcode service
   *
   * @returns
   */
  async getBasicService() {
    try {
      return await this.prismaService.service.findFirst({
        where: {
          name: "Basic",
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : `Error deleting service`,
      );
    }
  }
}
