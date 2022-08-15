import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { BookingService } from "src/features/bookings/services/BookingService";
import { CreateInvoiceInput } from "../input/CreateInvoiceInput";
import { FindOneInvoiceInput } from "../input/FindOneInvoiceInput";
import { InvoiceRepository } from "../repositories/InvoiceRepository";

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly bookingService: BookingService,
  ) {}

  async create(
    {
      invoiceNumber,
      status,
      amount,
      customerId,
      bookingId,
      userId,
    }: CreateInvoiceInput,
    { include }: FindOneInvoiceInput,
  ) {
    const generatedInvoiceNumber = randomBytes(10).toString("hex");
    const booking = await this.bookingService.findOrFailById(bookingId);
    const totalAmount = booking.additionalServiceItems.reduce(
      (acc, { price, quantity, discount }) =>
        acc + Number(price) * Number(quantity) * (1 - Number(discount)),
      0,
    );

    const invoice = await this.invoiceRepository.create(
      {
        invoiceNumber: generatedInvoiceNumber,
        status,
        amount: totalAmount,
        customerId,
        bookingId,
        userId,
      },
      { include },
    );

    return this.invoiceResource(invoice);
  }

  private invoiceResource(invocie: any) {
    return {
      id: invocie.id,
      invoiceNumber: invocie.invoiceNumber,
      status: invocie.status,
      amount: invocie.amount,
      customerId: invocie.customerId,
      customer: invocie.customer,
      bookingId: invocie.bookingId,
      booking: invocie.booking,
      userId: invocie.userId,
      user: invocie.user,
      paymentId: invocie.paymentId,
      payment: invocie.payment,
    };
  }
}
