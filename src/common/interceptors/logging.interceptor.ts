import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = request;
    const requestId = request.headers['x-request-id'] || 'unknown';

    const now = Date.now();

    this.logger.log(
      `[${requestId}] ${method} ${url} - Request params: ${JSON.stringify(
        params,
      )}, query: ${JSON.stringify(query)}`,
    );

    if (method !== 'GET') {
      this.logger.debug(`[${requestId}] Request body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `[${requestId}] ${method} ${url} ${
              context.switchToHttp().getResponse().statusCode
            } - ${responseTime}ms`,
          );
          this.logger.debug(
            `[${requestId}] Response data: ${JSON.stringify(data)}`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `[${requestId}] ${method} ${url} ERROR ${
              error.status || 500
            } - ${responseTime}ms`,
            error.stack,
          );
        },
      }),
    );
  }
}
