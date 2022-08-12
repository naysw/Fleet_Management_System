import { Injectable } from '@nestjs/common';
import { Booking, Customer } from '@prisma/client';
import { FindManyCustomerQueryInput } from '../input/FindManyCustomerQueryInput';
import { CustomerRepository } from '../repositories/CustomerRepository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  /**
   * find many customers
   *
   * @param param FindManyCustomerQueryInput
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
    const customers = await this.customerRepository.findMany({
      take,
      skip,
      filter,
      include,
      orderBy,
      sort,
      select,
    });

    return customers.map((customer) => this.customerResource(customer));
  }

  /**
   * map customer data
   *
   * @param customer Customer
   */
  private customerResource(customer: Customer & { bookings: Booking[] }) {
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      bookings: customer.bookings,
    };
  }
}
