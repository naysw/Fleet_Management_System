import Joi from "joi";

export interface PayInvoiceInput {
  status?: string;
  amount?: number;
  paidBy?: string;
  description?: string;
}

export const payInvoiceInputSchema = Joi.object<PayInvoiceInput>({
  amount: Joi.number().greater(0).required(),
  paidBy: Joi.string().trim(),
  description: Joi.string().trim(),
});
