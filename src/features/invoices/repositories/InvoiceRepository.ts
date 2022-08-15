import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";
import { registerInclude } from "src/utils/queryBuilder";
import { CreateInvoiceInput } from "../input/CreateInvoiceInput";
import { FindOneInvoiceInput } from "../input/FindOneInvoiceInput";

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
}
