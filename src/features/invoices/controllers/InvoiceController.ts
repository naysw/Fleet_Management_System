import { Body, Controller, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
import { BookingService } from "src/features/bookings/services/BookingService";
import { CustomerService } from "src/features/customers/services/CustomerService";
import { JoiValidationPipe } from "src/pipe/JoiValidationPipe";
import { ResponseResource } from "src/resources/ResponseResource";
import {
  CreateInvoiceInput,
  createInvoiceInputSchema,
} from "../input/CreateInvoiceInput";
import {
  FindOneInvoiceInput,
  findOneInvoiceQueryInputSchema,
} from "../input/FindOneInvoiceInput";
import { InvoiceService } from "../services/InvoiceService";

@Controller({
  path: "api/invoices",
  version: "1",
})
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly bookingService: BookingService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(createInvoiceInputSchema))
    {
      customerId,
      bookingId,
      status,
    }: Pick<CreateInvoiceInput, "customerId" | "bookingId" | "status">,
    @Req() req: any,
    @Query(new JoiValidationPipe(findOneInvoiceQueryInputSchema))
    { include }: FindOneInvoiceInput,
  ) {
    await this.customerService.findOrFailById(customerId);
    await this.bookingService.findOrFailById(bookingId);

    const invoice = await this.invoiceService.create(
      {
        bookingId,
        customerId,
        status,
        userId: req.user.id,
      },
      { include },
    );

    return new ResponseResource(invoice);
  }
}
