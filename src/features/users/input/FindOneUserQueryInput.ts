import Joi from "joi";
import { BaseQueryInput } from "src/input/BaseQueryInput";
import { allowedInclude } from "src/utils/customValidation";

export type FindOneUserQueryInput = Pick<BaseQueryInput, "include">;

export const findOneUserQueryInputSchema = Joi.object<FindOneUserQueryInput>({
  include: Joi.string()
    .max(255)
    .trim()
    .custom(allowedInclude(["roles"])),
});
