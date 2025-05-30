/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      'Something went wrong. Please try again later.';

    switch (true) {
      case exception instanceof HttpException: {
        status = exception.getStatus();
        const res = exception.getResponse();
        message =
          typeof res === 'string' ? res : (res as any).message || message;
        break;
      }

      case exception instanceof Error && exception.name === 'ValidationError': {
        status = HttpStatus.BAD_REQUEST;
        message = Object.values((exception as any).errors).map(
          (err: any) => err.message,
        );
        break;
      }

      case exception instanceof Error && exception.name === 'CastError': {
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid ${(exception as any).path}: ${(exception as any).value}`;
        break;
      }

      case exception instanceof MongoServerError && exception.code === 11000: {
        status = HttpStatus.CONFLICT;
        const duplicatedField = Object.keys(exception.keyValue || {})[0];
        message = `Duplicate value for field: ${duplicatedField}`;
        break;
      }

      default: {
        console.log(exception);
        break;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      message,
    });
  }
}
