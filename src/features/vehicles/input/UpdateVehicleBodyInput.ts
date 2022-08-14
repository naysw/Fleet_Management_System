import Joi from "joi";
import { CreateVehicleBodyInput } from "./CreateVehicleBodyInput";

export type UpdateVehicleBodyInput = Partial<CreateVehicleBodyInput>;

export const updateServiceBodyInputSchema = Joi.object<UpdateVehicleBodyInput>({
  plateNumber: Joi.string().max(255).trim(),
  categoryId: Joi.string().uuid({ version: "uuidv4" }).trim(),
  customerId: Joi.string().uuid({ version: "uuidv4" }).trim(),
  mediaId: Joi.string().uuid({ version: "uuidv4" }).trim(),
  description: Joi.string().max(1500).trim(),
});
