import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomerService } from 'src/features/customers/services/CustomerService';
import { JoiValidationPipe } from 'src/pipe/JoiValidationPipe';
import {
  CreateBookingBodyInput,
  createBookingBodyInputSchema,
} from '../input/CreateCustomerBodyInput';
import {
  FindManyBookingQueryInput,
  findManyBookingQueryInputSchema,
} from '../input/FindManyCustomerQueryInput';
import {
  FindOneBookingQueryInput,
  findOneBookingQueryInputSchema,
} from '../input/FindOneBookingQueryInput';
import { BookingService } from '../services/BookingService';

@Controller({
  path: 'api/bookings',
  version: '1',
})
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly customerService: CustomerService,
  ) {}

  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyBookingQueryInputSchema))
    { take, skip, select, sort, include, filter }: FindManyBookingQueryInput,
  ) {
    return 'This action returns all bookings';
  }

  @Post()
  async createBooking(
    @Body(new JoiValidationPipe(createBookingBodyInputSchema))
    {
      carNumber,
      customerId,
      from,
      to,
      notes,
      serviceIds,
    }: CreateBookingBodyInput,
    @Query(new JoiValidationPipe(findOneBookingQueryInputSchema))
    { include }: FindOneBookingQueryInput,
  ) {
    await this.customerService.findOrFailById(customerId);
    // TODO validate each incomming serviceId from serviceIds

    const booking = await this.bookingService.createOne(
      {
        carNumber,
        customerId,
        from,
        to,
        notes,
        serviceIds,
      },
      { include },
    );
  }
}
