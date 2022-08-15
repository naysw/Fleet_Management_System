import Joi from "joi";
import { BaseQueryInput } from "src/input/BaseQueryInput";
import { allowedInclude } from "src/utils/customValidation";

export type FindOneBookingQueryInput = Pick<BaseQueryInput, "include">;

export const findOneBookingQueryInputSchema =
  Joi.object<FindOneBookingQueryInput>({
    include: Joi.string()
      .max(255)
      .trim()
      .custom(
        allowedInclude([
          "additionalServiceItems",
          "customer",
          "vehicle",
          "parkingSlot",
        ]),
      ),
  });
