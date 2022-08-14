import Joi from "joi";
import { BaseQueryInput } from "src/input/BaseQueryInput";
import { allowedInclude } from "src/utils/customValidation";

export type FindOneVehicleQueryInput = Pick<BaseQueryInput, "include">;

export const findOneVehicleQueryInputSchema =
  Joi.object<FindOneVehicleQueryInput>({
    include: Joi.string()
      .max(255)
      .trim()
      .custom(allowedInclude(["category", "customer", "media"])),
  });
