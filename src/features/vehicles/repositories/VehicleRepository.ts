import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Vehicle } from "@prisma/client";
import { DEFAULT_TAKE, IS_DEV } from "src/config/constants";
import { FindOneBookingQueryInput } from "src/features/bookings/input/FindOneBookingQueryInput";
import { PrismaService } from "src/services/PrismaService";
import { registerInclude, registerOrderBy } from "src/utils/queryBuilder";
import { CreateVehicleBodyInput } from "../input/CreateVehicleBodyInput";
import { FindManyVehicleQueryInput } from "../input/FindManyVehicleQueryInput";
import { UpdateVehicleBodyInput } from "../input/UpdateVehicleBodyInput";

@Injectable()
export class VehicleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({
    take,
    skip,
    filter,
    include,
    orderBy,
    sort,
    select,
  }: FindManyVehicleQueryInput): Promise<Vehicle[]> {
    try {
      return await this.prismaService.vehicle.findMany({
        take: Number(take) || DEFAULT_TAKE,
        skip: Number(skip) || undefined,
        orderBy: registerOrderBy(orderBy),
        include: {
          category: registerInclude(include, "category"),
          customer: registerInclude(include, "customer"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findMany vehicles error",
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.prismaService.vehicle.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findById vehicle error",
      );
    }
  }

  async create(
    {
      plateNumber,
      categoryId,
      customerId,
      mediaId,
      description,
    }: CreateVehicleBodyInput,
    { include }: FindOneBookingQueryInput,
  ) {
    try {
      return await this.prismaService.vehicle.create({
        data: {
          plateNumber,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          customer: customerId ? { connect: { id: customerId } } : undefined,
          mediaId,
          description,
        },
        include: {
          category: registerInclude(include, "category"),
          customer: registerInclude(include, "customer"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "create vehicle error",
      );
    }
  }

  async update(
    id: string,
    {
      plateNumber,
      categoryId,
      customerId,
      mediaId,
      description,
    }: UpdateVehicleBodyInput,
    { include }: FindOneBookingQueryInput,
  ) {
    try {
      return await this.prismaService.vehicle.update({
        where: {
          id,
        },
        data: {
          plateNumber,
          categoryId,
          customerId,
          mediaId,
          description,
        },
        include: {
          category: registerInclude(include, "category"),
          customer: registerInclude(include, "customer"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "update vehicle error",
      );
    }
  }

  async delete(id: string) {
    try {
      return await this.prismaService.vehicle.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : `Error deleting vehicle with id ${id}`,
      );
    }
  }
}
