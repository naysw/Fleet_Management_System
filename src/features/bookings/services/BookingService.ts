import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AdditionalServiceItem,
  Booking,
  Customer,
  Vehicle,
} from "@prisma/client";
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

  async create(
    {
      vehicleId,
      parkingSlotId,
      customerId,
      from,
      to,
      duration,
      notes,
      additionalServiceItems,
    }: Omit<CreateBookingBodyInput, "additionalServiceItems"> & {
      additionalServiceItems: Partial<AdditionalServiceItem>[];
    },
    { include }: FindOneBookingQueryInput,
  ) {
    const booking = await this.bookingRepository.create(
      {
        vehicleId,
        parkingSlotId,
        customerId,
        from,
        to,
        duration,
        notes,
        additionalServiceItems,
      },
      { include },
    );

    return this.bookingResource(booking);
  }

  /**
   * find or fail by id
   *
   * @param id string
   * @returns
   */
  async findOrFailById(id: string) {
    const booking = await this.bookingRepository.findById(id);

    if (!booking)
      throw new NotFoundException(`booking with id ${id} not found`);

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

    return hasLength ? [...new Set(serviceIds)] : [];
  }

  private bookingResource({
    id,
    from,
    to,
    notes,
    status,
    customer,
    additionalServiceItems,
    vehicle,
    vehicleId,
    parkingSlotId,
  }: Booking & {
    customer?: Customer;
    additionalServiceItems?: any[];
    vehicle?: Vehicle;
  }) {
    return {
      id,
      from,
      to,
      notes,
      status,
      additionalServiceItems,
      customer,
      vehicle,
      parkingSlotId,
    };
  }
}
