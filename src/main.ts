import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
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
}
bootstrap();
