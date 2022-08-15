import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
import { BookingService } from "src/features/bookings/services/BookingService";
import { CustomerService } from "src/features/customers/services/CustomerService";
import { Mail } from "src/lib/Mail";
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
import {
  PayInvoiceInput,
  payInvoiceInputSchema,
} from "../input/PayInvoiceInput";
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
    const customer = await this.customerService.findOrFailById(customerId);
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

    if (customer.email) {
      new Mail(
        "test@test.com",
        customer.email,
        "Car Parking Invoice Created",
        "New invoice has been created",
        `<div>
          Hello ${customer.firstName} , 
          Thanks for using our service, here is your invoice
        </div>`,
      ).send();
    }

    return new ResponseResource(invoice);
  }

  @Patch(":id/pay")
  async pay(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(payInvoiceInputSchema))
    { status, amount, paidBy, description }: PayInvoiceInput,
    @Query(new JoiValidationPipe(findOneInvoiceQueryInputSchema))
    { include }: FindOneInvoiceInput,
  ) {
    const invoice = await this.invoiceService.findNotPaidInvoice(id);

    const paidInvoice = await this.invoiceService.pay(
      id,
      { status, amount, paidBy, description },
      { include },
    );

    if (invoice.customer?.email) {
      new Mail(
        "test@test.com",
        invoice.customer.email,
        "Car Parking Invoice Created",
        "New invoice has been created",
        `<div>
          Hello ${invoice.customer.firstName} , 
          Thanks for using our service, here is your invoice
        </div>`,
      ).send();
    }

    return new ResponseResource(paidInvoice).setMessage("Invoice paid");
  }
}
