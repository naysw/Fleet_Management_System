import { Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { BookingService } from "src/features/bookings/services/BookingService";
import { CreateInvoiceInput } from "../input/CreateInvoiceInput";
import { FindOneInvoiceInput } from "../input/FindOneInvoiceInput";
import { PayInvoiceInput } from "../input/PayInvoiceInput";
import { InvoiceRepository } from "../repositories/InvoiceRepository";

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly bookingService: BookingService,
  ) {}

  /**
   * create invoice from given data
   *
   * @param param0 CreateInvoiceInput
   * @param param1 FindOneInvoiceInput
   * @returns
   */
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
    /**
     * generate random invoice number
     */
    const generatedInvoiceNumber = randomBytes(10).toString("hex");

    /**
     * get booking with booking id
     */
    const booking = await this.bookingService.findOrFailById(bookingId);

    /**
     * get total amount of booking from each booking service
     */
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

  /**
   * find not paid invoice by id
   * not padi meaning status = "PENDING"
   *
   * @param id string
   * @returns Promise<Invoice>
   */
  async findNotPaidInvoice(id: string) {
    const invoice = await this.invoiceRepository.findNotPaidInvoice(id);

    console.log(invoice);

    if (!invoice)
      throw new NotFoundException(
        `Invoice with id ${id} not found or already paid`,
      );

    return this.invoiceResource(invoice);
  }

  /**
   * make payment for specify invoice
   *
   * @param id string
   * @param param1 PayInvoiceInput
   * @param param2 FindOneInvoiceInput
   * @returns Invoice
   */
  async pay(
    id: string,
    { status, amount, paidBy, description }: PayInvoiceInput,
    { include }: FindOneInvoiceInput,
  ) {
    const invoice = await this.invoiceRepository.pay(
      id,
      { status, amount, paidBy, description },
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
