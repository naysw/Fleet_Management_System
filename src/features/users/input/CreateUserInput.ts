import Joi from "joi";

export interface CreateUserInput {
  name?: string;
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
  roleIds?: string[];
}

export const createUserInputSchema = Joi.object<CreateUserInput>({
  name: Joi.string().required().max(100).trim(),
  username: Joi.string().required().max(100).trim(),
  email: Joi.string().email().min(5).max(200).trim(),
  password: Joi.string().required().min(5).max(200).trim(),
  confirmPassword: Joi.string()
    .required()
    .min(5)
    .max(200)
    .valid(Joi.ref("password"))
    .trim(),
  roleIds: Joi.array().items(
    Joi.string().required().uuid({ version: "uuidv4" }),
  ),
});
