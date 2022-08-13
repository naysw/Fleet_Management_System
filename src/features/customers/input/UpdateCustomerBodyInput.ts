import Joi from 'joi';

export interface UpdateCustomerBodyInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const updateCustomerBodyInputSchema =
  Joi.object<UpdateCustomerBodyInput>({
    firstName: Joi.string().max(255).trim(),
    lastName: Joi.string().max(255).trim(),
    email: Joi.string().email().max(255).trim(),
    phone: Joi.string().max(255).trim(),
    address: Joi.string().max(500).trim(),
  });
