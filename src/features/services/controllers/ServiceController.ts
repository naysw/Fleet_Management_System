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
import { Service } from "@prisma/client";
import { AdminGuard } from "src/features/auth/guards/AdminGuard";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
import { findManyServiceQueryInputSchema } from "src/features/customers/input/FindManyCustomerQueryInput";
import { JoiValidationPipe } from "src/pipe/JoiValidationPipe";
import { ResponseResource } from "src/resources/ResponseResource";
import {
  CreateServiceBodyInput,
  createServiceBodyInputSchema,
} from "../input/CreateServiceBodyInput";
import { FindManyServiceQueryInput } from "../input/FindManyServiceQueryInput";
import {
  UpdateServiceBodyInput,
  updateServiceBodyInputSchema,
} from "../input/UpdateServiceBodyInput";
import { ServiceService } from "../services/ServiceService";

@Controller({
  path: "api/services",
  version: "1",
})
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  /**
   * find many service
   *
   * @param param0 FindManyServiceQueryInput
   * @returns
   */
  @Get()
  async findMany(
    @Query(new JoiValidationPipe(findManyServiceQueryInputSchema))
    {
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    }: FindManyServiceQueryInput,
  ): Promise<ResponseResource<Service[]>> {
    const services = await this.serviceService.findMany({
      take,
      skip,
      filter,
      select,
      sort,
      include,
      orderBy,
    });

    return new ResponseResource(services);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createService(
    @Body(new JoiValidationPipe(createServiceBodyInputSchema))
    { name, price, description }: CreateServiceBodyInput,
  ): Promise<ResponseResource<Service>> {
    const service = await this.serviceService.createService({
      name,
      price,
      description,
    });

    return new ResponseResource(service).setMessage(
      `new service created successfully`,
    );
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  async updateService(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(updateServiceBodyInputSchema))
    { name, price, description }: UpdateServiceBodyInput,
  ): Promise<ResponseResource<Service>> {
    await this.serviceService.findOrFailById(id);

    const service = await this.serviceService.updateService(id, {
      name,
      price,
      description,
    });

    return new ResponseResource(service).setMessage(
      `service with ${id} updated`,
    );
  }

  /**
   * delete service from given id
   *
   * @param id string
   * @returns
   */
  @Delete(":id")
  @UseGuards(AdminGuard)
  async deleteService(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<ResponseResource<any>> {
    await this.serviceService.findOrFailById(id);

    await this.serviceService.deleteService(id);

    return new ResponseResource(null).setMessage(`service with ${id} deleted`);
  }
}
