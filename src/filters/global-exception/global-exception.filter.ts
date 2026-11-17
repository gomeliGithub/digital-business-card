import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { type HttpArgumentsHost } from '@nestjs/common/internal';
import { Response } from 'express';
import { type GqlContextType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Prisma } from '@/prisma/generated/prisma/client';

import { AppService } from '@/app.service';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
    constructor(private readonly _appService: AppService) {}

    async catch (exception: T, host: ArgumentsHost) {
        const context: GqlContextType = host.getType<GqlContextType>();

        if ( context === 'http' ) {
            const ctx: HttpArgumentsHost = host.switchToHttp();
            const response: Response = ctx.getResponse<Response>();

            const status: number = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

            const message: string = exception instanceof HttpException ? exception.message : 'Internal server error';
            await this._appService.logLineAsync(`${ status } ${ message }`, true, 'http');

            return response.status(status).json({
                statusCode: status,
                message,
                timestamp: new Date().toISOString()
            });
        }

        if ( context === 'graphql' ) {
            if ( exception instanceof Prisma.PrismaClientKnownRequestError ) {
                return this._handlePrismaKnownError(exception);
            }

            if ( exception instanceof Prisma.PrismaClientValidationError ) {
                await this._appService.logLineAsync(`Prisma Validation Error: ${ exception.message }`, true, 'graphQL');

                return new GraphQLError('Incorrect database request parameters', {
                    extensions: {
                        code: 'BAD_REQUEST',
                        status: HttpStatus.BAD_REQUEST
                    }
                });
            }

            if ( exception instanceof HttpException ) {
                const errorData: string | object = exception.getResponse();
                const rawMessage: string | string[] = typeof errorData === 'object' && errorData !== null && 'message' in errorData
                    ? ( errorData as { message: string | string[] } ).message
                    : exception.message;
                const formattedMessage: string = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                await this._appService.logLineAsync(`${ exception.getStatus() } ${ formattedMessage }`, true, 'graphQL');

                return new GraphQLError(formattedMessage, {
                    extensions: {
                        code: exception.name,
                        status: exception.getStatus(),
                        details: errorData
                    }
                });
            }

            if ( exception instanceof GraphQLError ) {
                await this._appService.logLineAsync(exception.message, true, 'graphQL');
                
                return exception;
            }

            const internalMessage: string = exception instanceof Error ? exception.message : 'Unknown error';
            await this._appService.logLineAsync(internalMessage, true, 'graphQL');

            return new GraphQLError('Internal server error', {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR',
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            });
        }
    }

    private async _handlePrismaKnownError (exception: Prisma.PrismaClientKnownRequestError): Promise<GraphQLError> {
        await this._appService.logLineAsync(`Prisma Error [${ exception.code }]: ${ exception.message }`, true, 'graphQL');

        switch ( exception.code ) {
            case 'P2003': {
                return new GraphQLError('Foreign key constraint failed', {
                    extensions: {
                        code: 'BAD_REQUEST',
                        status: HttpStatus.BAD_REQUEST
                    }
                });
            }
            case 'P2025': {
                return new GraphQLError('Record not found', {
                    extensions: {
                        code: 'NOT_FOUND',
                        status: HttpStatus.NOT_FOUND
                    }
                });
            }
            default: {
                return new GraphQLError('Internal database error', {
                    extensions: {
                        code: 'BAD_REQUEST',
                        status: HttpStatus.BAD_REQUEST
                    }
                });
            }
        }
    }
}