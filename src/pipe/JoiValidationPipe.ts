import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  /**
   * Method to implement a custom pipe.  Called with two parameters
   *
   * @param value argument before it is received by route handler method
   * @param metadata contains metadata about the value
   */
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);

    try {
      return await this.schema.validateAsync(value);
    } catch (error) {
      if (error instanceof ValidationError)
        throw new UnprocessableEntityException({
          message: error.message,
          errors: error.details,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          success: false,
        });

      console.log(error);
      throw new BadRequestException();
    }
  }
}
