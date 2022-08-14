import Joi from 'joi';
import { CreateServiceBodyInput } from './CreateServiceBodyInput';

export type UpdateServiceBodyInput = Partial<CreateServiceBodyInput>;

export const updateServiceBodyInputSchema = Joi.object<UpdateServiceBodyInput>({
  name: Joi.string().max(255).trim(),
  price: Joi.number(),
  description: Joi.string().max(1500).trim(),
});
