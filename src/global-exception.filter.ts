import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error('Global Exception Handler:', {
      timestamp: new Date().toISOString(),
      status,
      message,
      stack: exception instanceof Error ? exception.stack : exception,
    });

    if (!response.headersSent) {
      response.status(status).json({
        status,
        timestamp: new Date().toISOString(),
        message: message || 'Internal server error',
      });
    }
  }
}
