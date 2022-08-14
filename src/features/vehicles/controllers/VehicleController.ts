import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Vehicle } from "@prisma/client";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
import { CustomerService } from "src/features/customers/services/CustomerService";
import { JoiValidationPipe } from "src/pipe/JoiValidationPipe";
import { ResponseResource } from "src/resources/ResponseResource";
import {
  CreateVehicleBodyInput,
  createVehicleBodyInputSchema,
} from "../input/CreateVehicleBodyInput";
import {
  FindManyVehicleQueryInput,
  findManyVehicleQueryInputSchema,
} from "../input/FindManyVehicleQueryInput";
import {
  FindOneVehicleQueryInput,
  findOneVehicleQueryInputSchema,
} from "../input/FindOneVehicleQueryInput";
import {
  updateServiceBodyInputSchema,
  UpdateVehicleBodyInput,
} from "../input/UpdateVehicleBodyInput";
import { VehicleService } from "../services/VehicleService";

@Controller({
  path: "api/vehicles",
  version: "1",
})
@UseGuards(JwtAuthGuard)
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly customerService: CustomerService,
  ) {}

  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyVehicleQueryInputSchema))
    {
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    }: FindManyVehicleQueryInput,
  ): Promise<ResponseResource<Vehicle[]>> {
    const vehicles = await this.vehicleService.findMany({
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    });

    return new ResponseResource(vehicles);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createVehicleBodyInputSchema))
    {
      plateNumber,
      categoryId,
      customerId,
      mediaId,
      description,
    }: CreateVehicleBodyInput,
    @Query(new JoiValidationPipe(findOneVehicleQueryInputSchema))
    { include }: FindOneVehicleQueryInput,
  ): Promise<ResponseResource<Vehicle>> {
    await this.customerService.findOrFailById(customerId);

    const vehicle = await this.vehicleService.create(
      {
        plateNumber,
        categoryId,
        customerId,
        mediaId,
        description,
      },
      { include },
    );

    return new ResponseResource(vehicle).setMessage(
      `new vehicle created successfully`,
    );
  }

  @Patch(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(updateServiceBodyInputSchema))
    {
      plateNumber,
      categoryId,
      customerId,
      mediaId,
      description,
    }: UpdateVehicleBodyInput,
    @Query(new JoiValidationPipe(findOneVehicleQueryInputSchema))
    { include }: FindOneVehicleQueryInput,
  ): Promise<ResponseResource<Vehicle>> {
    await this.vehicleService.findOrFailById(id);
    if (customerId) await this.customerService.findOrFailById(customerId);

    const vehicle = await this.vehicleService.update(
      id,
      {
        plateNumber,
        categoryId,
        customerId,
        mediaId,
        description,
      },
      { include },
    );

    return new ResponseResource(vehicle).setMessage(
      `vehicle with ${id} updated`,
    );
  }

  /**
   * delete vehicle from given id
   *
   * @param id string
   * @returns
   */
  @Delete(":id")
  async deleteById(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<ResponseResource<any>> {
    await this.vehicleService.findOrFailById(id);

    await this.vehicleService.delete(id);

    return new ResponseResource(null).setMessage(`vehicle with ${id} deleted`);
  }
}
