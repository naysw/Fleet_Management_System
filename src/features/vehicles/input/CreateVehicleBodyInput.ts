import Joi from 'joi';

export interface CreateVehicleBodyInput {
  plateNumber: string;
  categoryId?: string;
  customerId: string;
  mediaId?: string;
  description?: string;
}

export const createVehicleBodyInputSchema = Joi.object<CreateVehicleBodyInput>({
  plateNumber: Joi.string().required().max(255).trim(),
  categoryId: Joi.string().uuid({ version: 'uuidv4' }).trim(),
  customerId: Joi.string()
    .required()
    .uuid({ version: 'uuidv4' })
    .required()
    .trim(),
  mediaId: Joi.string().uuid({ version: 'uuidv4' }).trim(),
  description: Joi.string().max(1500).trim(),
});
