import { Controller, Get, Query } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { JoiValidationPipe } from 'src/pipe/JoiValidationPipe';
import { ResponseResource } from 'src/resources/ResponseResource';
import {
  FindManyCustomerQueryInput,
  findManyCustomerQueryInputSchema,
} from '../input/FindManyCustomerQueryInput';
import { CustomerService } from '../services/CustomerService';

@Controller({
  path: 'api/customers',
  version: '1',
})
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  /**
   * find many customers
   *
   * @param param
   * @returns Promise<ResponseResource<Customer[]>>
   */
  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyCustomerQueryInputSchema))
    {
      take,
      skip,
      filter,
      include,
      orderBy,
      sort,
      select,
    }: FindManyCustomerQueryInput,
  ): Promise<ResponseResource<Customer[]>> {
    const customers = await this.customerService.findMany({
      take,
      skip,
      filter,
      include,
      orderBy,
      sort,
      select,
    });

    return new ResponseResource(customers);
  }
}
