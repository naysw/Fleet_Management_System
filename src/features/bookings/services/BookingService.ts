import { Injectable } from '@nestjs/common';
import { CreateBookingBodyInput } from '../input/CreateCustomerBodyInput';
import { FindOneBookingQueryInput } from '../input/FindOneBookingQueryInput';
import { BookingRepository } from '../repositories/BookingRepository';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async createOne(
    {
      vehicleId,
      parkingSlotId,
      customerId,
      from,
      to,
      notes,
      serviceIds,
    }: CreateBookingBodyInput,
    { include }: FindOneBookingQueryInput,
  ) {
    return await this.bookingRepository.createOne(
      {
        vehicleId,
        parkingSlotId,
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
