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
import { AdminGuard } from "src/features/auth/guards/AdminGuard";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
import { BookingService } from "src/features/bookings/services/BookingService";
import { CustomerService } from "src/features/customers/services/CustomerService";
import { Mail } from "src/lib/Mail";
import { JoiValidationPipe } from "src/pipe/JoiValidationPipe";
import { ResponseResource } from "src/resources/ResponseResource";
import { INVOICE_PAID } from "../config/constants";
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

  /**
   * create one invoice
   *
   * @param param0 CreateInvoiceInput
   * @param req Request
   * @param param2 FindOneInvoiceInput
   * @returns Promise<ResponseResource<Invoice>>
   */
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
  ): Promise<ResponseResource<any>> {
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

    /**
     * we will read html template and send with beauty mail,
     * for now let it be eargly :))
     */
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

  /**
   * make payment for invoice
   *
   * @param id string
   * @param param1 PayInvoiceInput
   * @param param2 FindOneInvoiceInput
   * @returns Promise<ResponseResource<Invoice>>
   */
  @Patch(":id/pay")
  @UseGuards(AdminGuard)
  async pay(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(payInvoiceInputSchema))
    { amount, paidBy, description }: PayInvoiceInput,
    @Query(new JoiValidationPipe(findOneInvoiceQueryInputSchema))
    { include }: FindOneInvoiceInput,
  ) {
    const invoice = await this.invoiceService.findNotPaidInvoice(id);

    const paidInvoice = await this.invoiceService.pay(
      id,
      { amount, paidBy, description, status: INVOICE_PAID },
      { include },
    );

    /**
     * we will read html template and send with beauty mail,
     * for now let it be eargly :))
     */
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
