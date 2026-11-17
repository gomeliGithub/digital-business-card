import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import fsPromises from 'node:fs/promises';
import path, { join } from 'node:path';

import { PrismaModule } from '@/prisma/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SandboxTokenMiddleware } from '@/graphql/middlewares/sandbox-token/sandbox-token.middleware';
import { GlobalExceptionFilter } from '@/filters/global-exception/global-exception.filter';

import { ProfileModule } from '@/common-entities/profile/profile.module';
import { LinkModule } from '@/common-entities/link/link.module';
import { SkillModule } from '@/common-entities/skill/skill.module';
import { ExperienceModule } from '@/common-entities/experience/experience.module';
import { ProjectModule } from '@/common-entities/project/project.module';

const nodeEnvironment: string = process.env.NODE_ENV ?? 'development';

@Module({
    imports: [
        ConfigModule.forRoot({ 
            isGlobal: true,
            envFilePath: nodeEnvironment === 'production' ? '../config/.env.production' : '../config/.env.development'
        }),
        ProfileModule, LinkModule, SkillModule, ExperienceModule, ProjectModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: async ( configService: ConfigService ) => {     
                return {
                    autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
                    graphiql: false,
                    introspection: configService.get('GRAPHQL_INTROSPECTION', 'true') === 'true',
                    debug: configService.get('GRAPHQL_DEBUG', 'false') === 'true',
                    cors: {
                        origin: false,
                        credentials: false,
                    },
                    plugins: [
                        ApolloServerPluginLandingPageLocalDefault({
                            embed: true
                        })
                    ] as ApolloDriverConfig['plugins']
                }
            },
            inject: [ ConfigService ]
        }),
        PrismaModule
    ],
    controllers: [ AppController ],
    providers: [ 
        AppService,
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        }
    ],
    exports: [ AppService ]
})
export class AppModule implements NestModule {
    configure (consumer: MiddlewareConsumer) {
        consumer.apply(SandboxTokenMiddleware).forRoutes('graphql');
    }

    constructor (
        private readonly _appService: AppService, 
        private readonly _configService: ConfigService
    ) {
        ( async () => {
            if ( nodeEnvironment === 'production' ) await this._generateAndWriteSandboxAPIKeys();
        })();
    }

    private async _generateAndWriteSandboxAPIKeys (): Promise<void> {
        try {
            const configDirPath: string = path.join(process.cwd(), 'config');
            await fsPromises.mkdir(configDirPath);

            const apiKeys: string[] = await this._appService.generateSandboxAPIKeys(5);
            this._configService.set('SANDBOX_API_KEYS', apiKeys.join(','));
            const apiKeysJoinedStr: string = apiKeys.join(',\n');

            await fsPromises.writeFile(path.join(configDirPath, 'sandboxAPIKeys.txt'), apiKeysJoinedStr);

            await this._appService.logLineAsync(`Sandbox API keys succesfully write to file ${ path.join(configDirPath, 'sandboxAPIKeys.txt') }. Keys: \n${ apiKeysJoinedStr }`, false, 'internal');
        } catch {
            this._appService.logLineAsync('sandboxAPIKeys.txt file writting error', true, 'internal');
        }
    }
}