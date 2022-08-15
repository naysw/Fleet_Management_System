import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdditionalServiceItem } from "@prisma/client";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
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
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly customerService: CustomerService,
    private readonly vehicleService: VehicleService,
    private readonly serviceService: ServiceService,
  ) {}

  /**
   * find many booking
   *
   * @param param0 FindOneBookingQueryInput
   * @returns string
   */
  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyBookingQueryInputSchema))
    { take, skip, select, sort, include, filter }: FindManyBookingQueryInput,
  ) {
    return "This action returns all bookings";
  }

  /**
   * create one booking from given input data
   *
   * @param param0 CreateBookingBodyInput
   * @param param1 FindOneBookingQueryInput
   * @returns Promise<ResponseResource<Bookding>>
   */
  @Post()
  async createBooking(
    @Body(new JoiValidationPipe(createBookingBodyInputSchema))
    {
      vehicleId,
      customerId,
      parkingSlotId,
      from,
      to,
      duration,
      notes,
      additionalServiceItems,
    }: CreateBookingBodyInput,
    @Query(new JoiValidationPipe(findOneBookingQueryInputSchema))
    { include }: FindOneBookingQueryInput,
  ): Promise<ResponseResource<any>> {
    /**
     * validate incoming customerId is whether exist or not
     */
    await this.customerService.findOrFailById(customerId);

    /**
     * validate incoming vehicleId is whether exist or not
     */
    await this.vehicleService.findOrFailById(vehicleId);

    const hasAdditionalServiceItems =
      additionalServiceItems &&
      Array.isArray(additionalServiceItems) &&
      additionalServiceItems.length > 0;

    /**
     * validate incoming serviceId is whether exist or not
     */
    if (hasAdditionalServiceItems)
      await this.serviceService.existsServiceIds(
        additionalServiceItems.map((item) => item.serviceId),
      );

    /**
     * get default basic service
     */
    const defaultBasicService =
      await this.serviceService.getDefaultBasicService();

    console.log(defaultBasicService);

    /**
     * merge incoming services with default basic service
     */

    const basicItem = {
      serviceId: defaultBasicService.id,
      quantity: 1,
      discount: 0,
    };

    const addSItems = hasAdditionalServiceItems
      ? [basicItem, ...additionalServiceItems]
      : [basicItem];

    console.log(addSItems);

    /**
     * assign empty array to additionalServiceItems
     */
    let asi: Pick<
      AdditionalServiceItem,
      "name" | "quantity" | "price" | "discount"
    >[] = [];

    /**
     * loop through additionalServiceItems and assign to asi
     */
    for (const { serviceId, quantity, discount } of addSItems) {
      const service = await this.serviceService.findOrFailById(serviceId);

      asi.push({
        name: service.name,
        quantity,
        price: service.price * quantity,
        discount,
      });
    }

    console.log("asi", asi);

    const booking = await this.bookingService.create(
      {
        vehicleId,
        parkingSlotId,
        customerId,
        from,
        to,
        duration,
        notes,
        additionalServiceItems: asi,
      },
      { include },
    );

    return new ResponseResource(booking)
      .setMessage("Booking created")
      .setStatusCode(HttpStatus.CREATED);
  }
}
