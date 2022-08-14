import Joi from "joi";

export interface LoginInput {
  username: string;
  password: string;
}

export const loginInputSchema = Joi.object<LoginInput>().keys({
  username: Joi.string().required().max(255).trim(),
  password: Joi.string().required().min(6).max(30).trim(),
});
