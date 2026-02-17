import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export async function validateDto<T>(dtoClass: new () => T, plain: any): Promise<T> {
  const instance = plainToInstance(dtoClass, plain, { enableImplicitConversion: true });
  const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true });

  if (errors.length > 0) {
    // Collect all error messages
    const messages = errors
      .map((err) => Object.values(err.constraints || {}))
      .flat();
    throw new Error(messages.join(", "));
  }

  return instance;
}
