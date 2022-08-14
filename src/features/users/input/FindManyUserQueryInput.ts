import Joi from "joi";
import { BaseQueryInput } from "src/input/BaseQueryInput";
import { allowedInclude, allowedOrderBy } from "src/utils/customValidation";

export type FindManyUserQueryInput = BaseQueryInput;

export const findManyUserQueryInputSchema = Joi.object({
  take: Joi.number().max(255),
  skip: Joi.number().max(255),
  include: Joi.string()
    .max(255)
    .trim()
    .custom(allowedInclude(["roles"])),
  orderBy: Joi.string()
    .trim()
    .custom(allowedOrderBy(["name", "createdAt"])),
});
