import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import exp from 'constants';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest();

    let statusCode =
      exception instanceof HttpException
        ? exception?.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      (Array.isArray(exception?.response?.message) &&
        exception?.response?.message[0]) ||
      exception.response?.message?.response?.message ||
      exception?.response?.message ||
      exception?.response?.error ||
      exception?.message ||
      exception?.response ||
      'Internal Server Error';

    let code =
      exception.response?.message?.response?.code ||
      exception?.response?.message?.code ||
      exception?.response?.code ||
      exception?.code ||
      statusCode;

    if (exception?.response?.code === 11000 || exception?.code === 11000) {
      statusCode = HttpStatus.CONFLICT;
      message = `Conflict, duplicate key error: ${Object.keys(exception.keyValue)}`;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      code,
      path: request.url,
    });
  }
}
