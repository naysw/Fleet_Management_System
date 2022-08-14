import { Injectable, NotFoundException } from "@nestjs/common";
import { Vehicle } from "@prisma/client";
import { CreateVehicleBodyInput } from "../input/CreateVehicleBodyInput";
import { FindManyVehicleQueryInput } from "../input/FindManyVehicleQueryInput";
import { FindOneVehicleQueryInput } from "../input/FindOneVehicleQueryInput";
import { UpdateVehicleBodyInput } from "../input/UpdateVehicleBodyInput";
import { VehicleRepository } from "../repositories/VehicleRepository";

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async findMany({
    take,
    skip,
    filter,
    select,
    sort,
    include,
    orderBy,
  }: FindManyVehicleQueryInput): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.findMany({
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    });

    return vehicles.map((vehicle) => this.vehicleResource(vehicle));
  }

  private vehicleResource(vehicle: Vehicle): Vehicle {
    return {
      ...vehicle,
    };
  }

  async findOrFailById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle)
      throw new NotFoundException(`Vehicle with id ${id} not found`);

    return vehicle;
  }

  async create(
    {
      plateNumber,
      categoryId,
      customerId,
      mediaId,
      description,
    }: CreateVehicleBodyInput,
    { include }: FindOneVehicleQueryInput,
  ) {
    const vehicle = await this.vehicleRepository.create(
      {
        plateNumber,
        categoryId,
        customerId,
        mediaId,
        description,
      },
      { include },
    );

    return this.vehicleResource(vehicle);
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
    { include }: FindOneVehicleQueryInput,
  ) {
    const vehicle = await this.vehicleRepository.update(
      id,
      {
        plateNumber,
        categoryId,
        customerId,
        mediaId,
        description,
      },
      { include },
    );

    return this.vehicleResource(vehicle);
  }

  async delete(id: string) {
    await this.vehicleRepository.delete(id);
  }
}
