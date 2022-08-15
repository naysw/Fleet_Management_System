import Joi from "joi";

export interface CreateInvoiceInput {
  bookingId: string;
  customerId: string;
  invoiceNumber?: string;
  status?: string;
  amount?: number;
  userId?: string;
}

export const createInvoiceInputSchema = Joi.object({
  bookingId: Joi.string().uuid({ version: "uuidv4" }).required().trim(),
  customerId: Joi.string().uuid({ version: "uuidv4" }).required().trim(),
});
