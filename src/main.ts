import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const logger = new Logger('App');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Limpiara las propiedades no esperadas
      whitelist: true,
      // Genera en la respuesta una mensaje que indica que alguna propiedad no se espera
      forbidNonWhitelisted: true,
      // Excluye los campos undefined
      transformOptions: {
        exposeUnsetFields: false
      }
    }),
  )

  await app.listen(process.env.PORT ?? 3000);
  logger.log('--------------------------');
  logger.log(`App running on port ${process.env.PORT ?? 3000}`)
  logger.log('--------------------------');
}
bootstrap();
