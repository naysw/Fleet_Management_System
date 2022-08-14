import Joi from 'joi';

export interface CreateBookingBodyInput {
  vehicleId: string;
  parkingSlotId?: string;
  customerId: string;
  from: string;
  to: string;
  notes?: string;
  serviceIds?: string[];
}

export const createBookingBodyInputSchema = Joi.object<CreateBookingBodyInput>({
  vehicleId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .max(255)
    .trim(),
  customerId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .max(255)
    .trim(),
  parkingSlotId: Joi.string().uuid({ version: 'uuidv4' }).max(255).trim(),
  from: Joi.date().required(),
  to: Joi.date().greater(Joi.ref('from')).required(),
  notes: Joi.string().max(1500).trim(),
  serviceIds: Joi.array().items(
    Joi.string().uuid({ version: 'uuidv4' }).max(255).trim(),
  ),
});
