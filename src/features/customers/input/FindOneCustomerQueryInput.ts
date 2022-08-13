import Joi from 'joi';
import { BaseQueryInput } from 'src/input/BaseQueryInput';
import { allowedInclude } from 'src/utils/customValidation';

export type FindOneCustomerQueryInput = Pick<BaseQueryInput, 'include'>;

export const findOneCustomerQueryInputSchema =
  Joi.object<FindOneCustomerQueryInput>({
    include: Joi.string()
      .max(255)
      .trim()
      .custom(allowedInclude(['bookings'])),
  });
