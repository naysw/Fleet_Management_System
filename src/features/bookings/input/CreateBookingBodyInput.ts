import Joi from "joi";

interface AdditionalServiceItems {
  serviceId: string;
  quantity: number;
  discount?: number;
}

export interface CreateBookingBodyInput {
  vehicleId: string;
  parkingSlotId?: string;
  customerId: string;
  from?: string;
  to?: string;
  duration?: number;
  notes?: string;
  additionalServiceItems: AdditionalServiceItems[];
}

export const createBookingBodyInputSchema = Joi.object<CreateBookingBodyInput>({
  vehicleId: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .max(255)
    .trim(),
  customerId: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .max(255)
    .trim(),
  parkingSlotId: Joi.string().uuid({ version: "uuidv4" }).max(255).trim(),
  from: Joi.date().required(),
  to: Joi.date().greater(Joi.ref("from")).required(),
  duration: Joi.number().greater(0).max(30).required(),
  notes: Joi.string().max(1500).trim(),
  additionalServiceItems: Joi.array().items(
    Joi.object({
      serviceId: Joi.string().uuid({ version: "uuidv4" }).trim(),
      quantity: Joi.number().greater(0).required(),
      discount: Joi.number(),
    }),
  ),
});
