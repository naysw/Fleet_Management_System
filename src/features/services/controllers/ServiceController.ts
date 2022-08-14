import { Controller, Get, Query } from '@nestjs/common';
import { Service } from '@prisma/client';
import { findManyServiceQueryInputSchema } from 'src/features/customers/input/FindManyCustomerQueryInput';
import { JoiValidationPipe } from 'src/pipe/JoiValidationPipe';
import { ResponseResource } from 'src/resources/ResponseResource';
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
}
