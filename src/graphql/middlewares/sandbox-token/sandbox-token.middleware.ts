import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SandboxTokenMiddleware implements NestMiddleware {
    constructor(private readonly _configService: ConfigService) {}

    use (req: Request, _: Response, next: NextFunction) {
        const isProduction: boolean = this._configService.get('NODE_ENV') === 'production';
        const apiKeys: string[] | undefined = this._configService.get('SANDBOX_API_KEYS')?.split(',').map(( key: string ) => key.trim());

        if ( isProduction && apiKeys && apiKeys.length > 0 ) {
            const providedKey: string | undefined = <string | undefined>req.query.api_key;

            if ( !providedKey || !apiKeys.includes(providedKey) ) {
                throw new ForbiddenException('Invalid or missing API key');
            }
        }

        next();
    }
}