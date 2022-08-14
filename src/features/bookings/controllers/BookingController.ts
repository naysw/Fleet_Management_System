import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { CustomerService } from "src/features/customers/services/CustomerService";
import { ServiceService } from "src/features/services/services/ServiceService";
import { VehicleService } from "src/features/vehicles/services/VehicleService";
import { JoiValidationPipe } from "src/pipe/JoiValidationPipe";
import { ResponseResource } from "src/resources/ResponseResource";
import {
  CreateBookingBodyInput,
  createBookingBodyInputSchema,
} from "../input/CreateBookingBodyInput";
import {
  FindManyBookingQueryInput,
  findManyBookingQueryInputSchema,
} from "../input/FindManyBookingQueryInput";
import {
  FindOneBookingQueryInput,
  findOneBookingQueryInputSchema,
} from "../input/FindOneBookingQueryInput";
import { BookingService } from "../services/BookingService";

@Controller({
  path: "api/bookings",
  version: "1",
})
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly customerService: CustomerService,
    private readonly vehicleService: VehicleService,
    private readonly serviceService: ServiceService,
  ) {}

  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyBookingQueryInputSchema))
    { take, skip, select, sort, include, filter }: FindManyBookingQueryInput,
  ) {
    return "This action returns all bookings";
  }

  @Post()
  async createBooking(
    @Body(new JoiValidationPipe(createBookingBodyInputSchema))
    {
      vehicleId,
      customerId,
      parkingSlotId,
      from,
      to,
      notes,
      serviceIds,
    }: CreateBookingBodyInput,
    @Query(new JoiValidationPipe(findOneBookingQueryInputSchema))
    { include }: FindOneBookingQueryInput,
  ) {
    await this.customerService.findOrFailById(customerId);
    await this.vehicleService.findOrFailById(vehicleId);
    if (serviceIds && serviceIds.length > 0)
      await this.serviceService.existsServiceIds(serviceIds);

    const booking = await this.bookingService.createOne(
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

    return new ResponseResource(booking)
      .setMessage("Booking created")
      .setStatusCode(HttpStatus.CREATED);
  }
}
