import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { JoiValidationPipe } from 'src/pipe/JoiValidationPipe';
import { ResponseResource } from 'src/resources/ResponseResource';
import {
  CreateCustomerBodyInput,
  createCustomerBodyInputSchema,
} from '../input/CreateCustomerBodyInput';
import {
  FindManyCustomerQueryInput,
  findManyServiceQueryInputSchema,
} from '../input/FindManyCustomerQueryInput';
import {
  FindOneCustomerQueryInput,
  findOneCustomerQueryInputSchema,
} from '../input/FindOneCustomerQueryInput';
import {
  UpdateCustomerBodyInput,
  updateCustomerBodyInputSchema,
} from '../input/UpdateCustomerBodyInput';
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
    @Query(new JoiValidationPipe(findManyServiceQueryInputSchema))
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

  /**
   * create customer
   *
   * @param param0 StoreCustomerBodyInput
   * @returns Promise<ResponseResource<Customer>>
   */
  @Post()
  async createCustomer(
    @Body(new JoiValidationPipe(createCustomerBodyInputSchema))
    { firstName, lastName, email, phone, address }: CreateCustomerBodyInput,
    @Query(new JoiValidationPipe(findOneCustomerQueryInputSchema))
    { include }: FindOneCustomerQueryInput,
  ): Promise<ResponseResource<Customer>> {
    console.log(include);
    await this.customerService.customerExistsWithEmail(email);

    const customer = await this.customerService.createCustomer(
      {
        firstName,
        lastName,
        email,
        phone,
        address,
      },
      { include },
    );

    return new ResponseResource(customer).setMessage('new customer created');
  }

  /**
   * update customer from given id
   *
   * @param id string
   * @param param1 UpdaeCustomerBodyInput
   */
  @Patch(':id')
  async updateCustomer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(updateCustomerBodyInputSchema))
    { firstName, lastName, email, phone, address }: UpdateCustomerBodyInput,
    @Query(new JoiValidationPipe(findOneCustomerQueryInputSchema))
    { include }: FindOneCustomerQueryInput,
  ): Promise<ResponseResource<any>> {
    await this.customerService.findOrFailById(id);

    const customer = await this.customerService.updateCustomer(
      id,
      { firstName, lastName, email, phone, address },
      { include },
    );

    return new ResponseResource(customer).setMessage('customer updated');
  }

  /**
   * delete customer from given id
   *
   * @param id string
   * @returns
   */
  @Delete(':id')
  async deleteCustomer(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseResource<any>> {
    await this.customerService.findOrFailById(id);

    await this.customerService.deleteCustomer(id);

    return new ResponseResource(null).setMessage(`customer with ${id} deleted`);
  }
}
