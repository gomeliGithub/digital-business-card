import { Injectable } from '@nestjs/common';

import * as crypto from 'node:crypto';
import { promisify } from 'node:util';
import path from 'node:path';
import fsPromises from 'node:fs/promises';
import { EOL } from 'node:os';

import { TPrismaProfileSelect } from './types';

@Injectable()
export class AppService {
    private readonly httpLogFilePath: string = path.join(process.cwd(), 'logs', 'http.log');
    private readonly httpErrorLogFilePath: string = path.join(process.cwd(), 'logs', 'httpError.log');
    private readonly graphQLLogFilePath: string = path.join(process.cwd(), 'logs', 'graphQL.log');
    private readonly graphQLErrorLogFilePath: string = path.join(process.cwd(), 'logs', 'graphQLError.log');
    private readonly internalLogFilePath: string = path.join(process.cwd(), 'logs', 'internal.log');
    private readonly internalErrorLogFilePath: string = path.join(process.cwd(), 'logs', 'internalError.log');

    constructor () {
        ( async () => await fsPromises.mkdir(path.join(process.cwd(), 'logs'), { recursive: true }) )();
    }

    public async generateSandboxAPIKeys (keysCount: number): Promise<string[]> {
        const randomBytesAsync: ( arg1: number ) => Promise<Buffer> = promisify(crypto.randomBytes);

        const promises: Promise<Buffer>[] = [];

        for ( let i = 0; i < keysCount; i++ ) {
            promises.push(randomBytesAsync(64));
        }

        const buffers: Buffer<ArrayBufferLike>[] = await Promise.all(promises);

        await this.logLineAsync('Sandbox API keys succesfully generate', false, 'internal');

        return buffers.map(buffer => buffer.toString('hex'));
    }

    public async logLineAsync (logLine: string, error: boolean, logType: 'graphQL' | 'http' | 'internal'): Promise<void> {
        const logDate: Date = new Date();

        const time: string = logDate.toLocaleDateString() + ' ' + logDate.toLocaleTimeString();
        const fullLogLine: string = time + " " + logLine;

        let logFilePath: string | null = null;

        switch ( logType ) {
            case 'http': { logFilePath = !error ? this.httpLogFilePath : this.httpErrorLogFilePath; break; }
            case 'graphQL': { logFilePath = !error ? this.graphQLLogFilePath : this.graphQLErrorLogFilePath; break; }
            case 'internal': { logFilePath = !error ? this.internalLogFilePath : this.internalErrorLogFilePath; break; }
        }
        
        // oxlint-disable-next-line no-console
        if ( !error ) console.info(fullLogLine);
        // oxlint-disable-next-line no-console
        else console.error(fullLogLine);

        try {
            await fsPromises.writeFile(logFilePath, fullLogLine + EOL);
        } catch {
            throw new Error();
        }
    }

    public createSelectArgs (requestedIncludeFields: string[]): TPrismaProfileSelect {
        const selectArgs: TPrismaProfileSelect = {};
        
        requestedIncludeFields.forEach(requiredField => {
            selectArgs[requiredField] = true;
        });

        return selectArgs;
    }
}