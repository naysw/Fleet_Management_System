import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@prisma/client';
import { CreateServiceBodyInput } from '../input/CreateServiceBodyInput';
import { FindManyServiceQueryInput } from '../input/FindManyServiceQueryInput';
import { UpdateServiceBodyInput } from '../input/UpdateServiceBodyInput';
import { ServiceRepository } from '../repositories/ServiceRepository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async findMany({
    take,
    skip,
    filter,
    select,
    sort,
    include,
    orderBy,
  }: FindManyServiceQueryInput): Promise<Service[]> {
    const services = await this.serviceRepository.findMany({
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    });

    return services.map((service) => this.serviceResource(service));
  }

  private serviceResource(service: Service): Service {
    return {
      ...service,
    };
  }

  async findOrFailById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);

    if (!service)
      throw new NotFoundException(`Service with id ${id} not found`);

    return service;
  }

  async createService({ name, price, description }: CreateServiceBodyInput) {
    const service = await this.serviceRepository.createService({
      name,
      price,
      description,
    });

    return this.serviceResource(service);
  }

  async updateService(
    id: string,
    { name, price, description }: UpdateServiceBodyInput,
  ) {
    const service = await this.serviceRepository.updateService(id, {
      name,
      price,
      description,
    });

    return this.serviceResource(service);
  }
}
