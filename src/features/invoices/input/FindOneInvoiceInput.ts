import Joi from "joi";
import { BaseQueryInput } from "src/input/BaseQueryInput";
import { allowedInclude } from "src/utils/customValidation";

export interface FindOneInvoiceInput extends Pick<BaseQueryInput, "include"> {}

export const findOneInvoiceQueryInputSchema = Joi.object<FindOneInvoiceInput>({
  include: Joi.string()
    .max(255)
    .trim()
    .custom(allowedInclude(["customer", "booking", "payment"])),
});
