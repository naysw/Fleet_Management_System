import { ConflictException, Injectable } from '@nestjs/common';
import { Booking, Customer } from '@prisma/client';
import { CreateCustomerBodyInput } from '../input/CreateCustomerBodyInput';
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
   * create customer
   *
   * @param param0 CreateCustomerBodyInput
   * @returns Promise<Customer>
   */
  async createCustomer({
    firstName,
    lastName,
    email,
    phone,
    address,
  }: CreateCustomerBodyInput): Promise<any> {
    const customer = await this.customerRepository.createCustomer({
      firstName,
      lastName,
      email,
      phone,
      address,
    });

    return this.customerResource(customer);
  }

  /**
   * check customer exists with given email
   *
   * @param email string
   * @returns
   */
  async isCustomerExists(email: string) {
    const customer = await this.customerRepository.isCustomerExists(email);

    if (customer)
      throw new ConflictException(
        `customer with email ${email} already exists`,
      );

    return customer;
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
