import Joi from 'joi';

export interface StoreCustomerBodyInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export const storeCustomerBodyInputSchema = Joi.object<StoreCustomerBodyInput>(
  {},
);
