import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Service } from '@prisma/client';
import { findManyServiceQueryInputSchema } from 'src/features/customers/input/FindManyCustomerQueryInput';
import { JoiValidationPipe } from 'src/pipe/JoiValidationPipe';
import { ResponseResource } from 'src/resources/ResponseResource';
import {
  CreateServiceBodyInput,
  createServiceBodyInputSchema,
} from '../input/CreateServiceBodyInput';
import { FindManyServiceQueryInput } from '../input/FindManyServiceQueryInput';
import { ServiceService } from '../services/ServiceService';

@Controller({
  path: 'api/services',
  version: '1',
})
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyServiceQueryInputSchema))
    {
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    }: FindManyServiceQueryInput,
  ): Promise<ResponseResource<Service[]>> {
    const services = await this.serviceService.findMany({
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    });

    return new ResponseResource(services);
  }

  @Post()
  async createService(
    @Body(new JoiValidationPipe(createServiceBodyInputSchema))
    { name, price, description }: CreateServiceBodyInput,
  ): Promise<ResponseResource<Service>> {
    const service = await this.serviceService.createService({
      name,
      price,
      description,
    });

    return new ResponseResource(service);
  }
}
