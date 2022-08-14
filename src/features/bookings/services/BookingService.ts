import { Injectable } from "@nestjs/common";
import { Booking, Customer, Vehicle } from "@prisma/client";
import { CreateBookingBodyInput } from "../input/CreateBookingBodyInput";
import { FindOneBookingQueryInput } from "../input/FindOneBookingQueryInput";
import { BookingRepository } from "../repositories/BookingRepository";

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
    const booking = await this.bookingRepository.createOne(
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

    return this.bookingResource(booking);
  }

  private bookingResource({
    id,
    from,
    to,
    notes,
    status,
    customer,
    services,
    vehicle,
    vehicleId,
    parkingSlotId,
  }: Booking & { customer?: Customer; services?: any[]; vehicle?: Vehicle }) {
    return {
      id,
      from,
      to,
      notes,
      status,
      services:
        services && Array.isArray(services)
          ? services.map((service) => service.service)
          : undefined,
      customer,
      vehicle,
      parkingSlotId,
    };
  }
}
