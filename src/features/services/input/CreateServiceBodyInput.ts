import Joi from 'joi';

export interface CreateServiceBodyInput {
  name: string;
  price: number;
  description?: string;
}

export const createServiceBodyInputSchema = Joi.object<CreateServiceBodyInput>({
  name: Joi.string().required().max(255).trim(),
  price: Joi.number().required(),
  description: Joi.string().max(1500).trim(),
});
