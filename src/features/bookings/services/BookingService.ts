import { Injectable } from "@nestjs/common";
import { Booking, Customer, Vehicle } from "@prisma/client";
import { ServiceService } from "src/features/services/services/ServiceService";
import { CreateBookingBodyInput } from "../input/CreateBookingBodyInput";
import { FindOneBookingQueryInput } from "../input/FindOneBookingQueryInput";
import { BookingRepository } from "../repositories/BookingRepository";

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly serviceService: ServiceService,
  ) {}

  async createOne(
    {
      vehicleId,
      parkingSlotId,
      customerId,
      from,
      to,
      duration,
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
        duration,
        notes,
        serviceIds,
      },
      { include },
    );

    return this.bookingResource(booking);
  }

  /**
   * get service ids
   *
   * @param serviceIds string[]
   * @returns string[]
   */
  getServiceIds(serviceIds: string[]): string[] {
    const hasLength = serviceIds && serviceIds.length > 0;

    /**
     * this is hard coded basic service id
     * we will need to parse basic service id from setting database table that define as default service id
     *
     * @example
     */
    const basicServiceId = "e9ca5647-fb16-46e8-b23f-ff63be5a6352";

    return hasLength
      ? [...new Set(serviceIds.concat(basicServiceId))]
      : [basicServiceId];
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
