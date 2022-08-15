import Joi from "joi";
import { BaseQueryInput } from "src/input/BaseQueryInput";
import { allowedInclude, allowedOrderBy } from "src/utils/customValidation";

export interface FindManyCustomerQueryInput extends BaseQueryInput {}

export const findManyServiceQueryInputSchema =
  Joi.object<FindManyCustomerQueryInput>({
    take: Joi.number().max(255),
    skip: Joi.number().max(255),
    include: Joi.string()
      .max(255)
      .trim()
      .custom(allowedInclude(["bookings"])),
    orderBy: Joi.string()
      .trim()
      .custom(allowedOrderBy(["createdAt"])),
    keyword: Joi.string().max(255).trim(),
  });
