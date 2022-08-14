import Joi from 'joi';
import { BaseQueryInput } from 'src/input/BaseQueryInput';
import { allowedInclude, allowedOrderBy } from 'src/utils/customValidation';

export interface FindManyBookingQueryInput extends BaseQueryInput {}

export const findManyBookingQueryInputSchema =
  Joi.object<FindManyBookingQueryInput>({
    take: Joi.number().max(255),
    skip: Joi.number().max(255),
    include: Joi.string().max(255).trim().custom(allowedInclude([])),
    orderBy: Joi.string()
      .trim()
      .custom(allowedOrderBy(['createdAt'])),
    keyword: Joi.string().max(255).trim(),
  });
