import Joi from "joi";

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export const updateUserInputSchema = Joi.object<UpdateUserInput>({
  name: Joi.string().optional().max(100).trim(),
  email: Joi.string().email().optional().min(5).max(200).trim(),
  password: Joi.string().optional().min(5).max(200).trim(),
});
