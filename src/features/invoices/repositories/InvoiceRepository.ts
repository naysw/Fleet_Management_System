import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/PrismaService";
import { CreateInvoiceInput } from "../input/CreateInvoiceInput";

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    invoiceNumber,
    status,
    amount,
    customerId,
    bookingId,
    userId,
  }: CreateInvoiceInput) {
    try {
      return await this.prismaService.invoice.create({
        data: {
          invoiceNumber,
          status,
          amount,
          customer: {
            connect: {
              id: customerId,
            },
          },
          booking: {
            connect: {
              id: bookingId,
            },
          },
          user: {
            connect: { id: userId },
          },
          payment: {
            create: {},
          },
        },
      });
    } catch (error) {}
  }
}
