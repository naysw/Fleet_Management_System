export class ResponseResource<TData> {
  private message = 'Ok';
  private statusCode = 200;
  private success = true;

  constructor(private data: TData) {
    //
  }

  /**
   * set message
   *
   * @param message string
   * @returns this
   */
  setMessage(message: string): this {
    this.message = message;

    return this;
  }

  /**
   * set status code
   *
   * @param statusCode number
   */
  setStatusCode(statusCode: number): this {
    this.statusCode = statusCode;

    return this;
  }
}
