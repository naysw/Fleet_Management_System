import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IS_DEV } from "src/config/constants";
import { BOOKING_COMPLETED } from "src/features/bookings/config/constants";
import { PrismaService } from "src/services/PrismaService";
import { registerInclude } from "src/utils/queryBuilder";
import { INVOICE_PENDING } from "../config/constants";
import { CreateInvoiceInput } from "../input/CreateInvoiceInput";
import { FindOneInvoiceInput } from "../input/FindOneInvoiceInput";
import { PayInvoiceInput } from "../input/PayInvoiceInput";

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
        include: {
          customer: registerInclude(include, "customer"),
          booking: registerInclude(include, "booking"),
          payment: registerInclude(include, "payment"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating invoice: ${IS_DEV && error}`,
      );
    }
  }

  async findNotPaidInvoice(id: string) {
    try {
      return await this.prismaService.invoice.findFirst({
        where: {
          AND: [
            {
              id,
            },
            {
              status: INVOICE_PENDING,
            },
          ],
        },
        include: {
          customer: true,
          booking: true,
          payment: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding invoice: ${IS_DEV && JSON.stringify(error)}`,
      );
    }
  }

  async pay(
    id: string,
    { status, amount, paidBy, description }: PayInvoiceInput,
    { include }: FindOneInvoiceInput,
  ) {
    try {
      return await this.prismaService.invoice.update({
        where: { id },
        data: {
          status,
          payment: {
            update: {
              status,
              amount,
              paidBy,
              description,
            },
          },
          booking: {
            update: {
              status: BOOKING_COMPLETED,
            },
          },
        },
        include: {
          customer: registerInclude(include, "customer"),
          booking: registerInclude(include, "booking"),
          payment: registerInclude(include, "payment"),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating invoice: ${IS_DEV && error}`,
      );
    }
  }
}
