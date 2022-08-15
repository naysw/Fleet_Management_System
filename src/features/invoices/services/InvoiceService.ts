import { Injectable } from "@nestjs/common";
import { CreateInvoiceInput } from "../input/CreateInvoiceInput";
import { InvoiceRepository } from "../repositories/InvoiceRepository";

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async create({
    invoiceNumber,
    status,
    amount,
    customerId,
    bookingId,
    userId,
  }: CreateInvoiceInput) {
    const amt = "";

    const invoice = await this.invoiceRepository.create({
      invoiceNumber,
      status,
      amount,
      customerId,
      bookingId,
      userId,
    });

    return this.invoiceResource(invoice);
  }

  private invoiceResource(invocie: any) {
    //
  }
}
