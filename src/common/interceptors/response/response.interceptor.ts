import { Metadata } from '@/interfaces';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res: { data: any; metadata?: Metadata }) =>
        this.responseHandler(res, context)
      ),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context))
      )
    );
  }

  responseHandler(res: { data: any; metadata?: Metadata }, context: ExecutionContext) {
    const { data, metadata } = res;

    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return {
      success: true,
      statusCode,
      metadata: {
        limit: metadata?.limit,
        page: metadata?.page,
        total: metadata?.total,
        totalPages: metadata?.totalPages
      },
      result: data
    };
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log('exception', exception);

    let message: string | string[] = 'Internal server error';

    const responseExp = exception.hasOwnProperty('getResponse')
      ? exception.getResponse()
      : null;

    if (typeof responseExp === 'string') {
      message = responseExp;
    } else if (responseExp && typeof responseExp === 'object') {
      message = (responseExp as any).message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      result: []
    });
  }
}
