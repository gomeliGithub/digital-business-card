import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    const portFromEnv: number = parseInt(process.env.PORT as string, 10);
    const correctPort: number = !isNaN(portFromEnv) ? portFromEnv : 3000;
    await app.listen(correctPort);
}
void bootstrap();