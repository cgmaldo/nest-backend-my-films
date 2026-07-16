import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as fs from 'fs';

async function bootstrap() {

  const logger = new Logger('App');

  // Certificado Root Local para activar Https como localhost
  // const httpsOptions = {
  //   key: fs.readFileSync(__dirname + '/../src/server.key'),
  //   cert: fs.readFileSync(__dirname + '/../src/server.crt'),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // Opcional, para claridad visual
      in: 'header',
    }, 'bearer-token')
    .setTitle('Cgmaldo.MyFilms RESTFul API')
    .setDescription('MyFilms endpoints')
    .setVersion('1.0')
    .addTag('Auths', 'All auths', undefined)
    .addTag('Films', 'All films', undefined)
    .addTag('Files - Get and Upload', 'All files', undefined)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Proporciona un endpoint para descargar documentación en formato JSON
  // SwaggerModule.setup('api', app, documentFactory,{
  //   jsonDocumentUrl: 'api/json',
  // });

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
