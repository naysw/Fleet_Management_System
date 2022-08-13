import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, Customer } from '@prisma/client';
import { CreateCustomerBodyInput } from '../input/CreateCustomerBodyInput';
import { FindManyCustomerQueryInput } from '../input/FindManyCustomerQueryInput';
import { FindOneCustomerQueryInput } from '../input/FindOneCustomerQueryInput';
import { UpdateCustomerBodyInput } from '../input/UpdateCustomerBodyInput';
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
  async createCustomer(
    { firstName, lastName, email, phone, address }: CreateCustomerBodyInput,
    { include }: FindOneCustomerQueryInput,
  ): Promise<any> {
    const customer = await this.customerRepository.createCustomer(
      {
        firstName,
        lastName,
        email,
        phone,
        address,
      },
      { include },
    );

    return this.customerResource(customer);
  }

  /**
   * check customer exists with given email
   *
   * @param email string
   * @returns
   */
  async customerExistsWithEmail(email: string) {
    const customer = await this.customerRepository.isCustomerExists(email);

    if (customer)
      throw new ConflictException(
        `customer with email ${email} already exists`,
      );

    return customer;
  }

  /**
   * find or fail by id
   *
   * @param id string
   * @returns
   */
  async findOrFailById(id: string) {
    const customer = await this.customerRepository.findById(id);

    if (!customer)
      throw new NotFoundException(`customer with id ${id} not found`);

    return customer;
  }

  /**
   * update customer from given id
   *
   * @param id string
   * @param param1 UpdateCustomerBodyInput
   * @param param2 FindOneCustomerQueryInput
   * @returns Promise<Customer>
   */
  async updateCustomer(
    id: string,
    { firstName, lastName, email, phone, address }: UpdateCustomerBodyInput,
    { include }: FindOneCustomerQueryInput,
  ) {
    const customer = await this.customerRepository.updateCustomer(
      id,
      { firstName, lastName, email, phone, address },
      { include },
    );

    return this.customerResource(customer);
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
