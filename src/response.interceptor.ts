import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';



@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<T>): any{
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = response.statusCode;
        return next.handle().pipe(
            map((data:any) => ({
                statusCode: status,
                data: data.data || data,
                message: data?.message|| null,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
