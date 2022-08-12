import Joi from 'joi';

export interface CreateCustomerBodyInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export const createCustomerBodyInputSchema =
  Joi.object<CreateCustomerBodyInput>({
    firstName: Joi.string().required().max(255).trim(),
    lastName: Joi.string().required().max(255).trim(),
    email: Joi.string().email().required().max(255).trim(),
    phone: Joi.string().required().max(255).trim(),
    address: Joi.string().required().max(500).trim(),
  });
