import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixes all HTTP routes with /api/users
  app.setGlobalPrefix('api/users');

  // Enables CORS for cross-origin requests
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Applies validation globally with transformation and whitelisting
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error if unknown properties are passed
      transform: true, // Automatically transform payloads to DTO classes
    }),
  );

  // Swagger configuration for API documentation
  const config = new DocumentBuilder()
    .setTitle('User Search Microservice')
    .setDescription(
      'Allows searching for users by ID or email. Requires admin role.',
    )
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT support in Swagger UI
    .addTag('Users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI available at /api/docs

  // Connects the microservice to Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-service-login',
        brokers: ['3.232.44.31:9092'],
      },
      consumer: {
        groupId: 'auth-service-login-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003); // Starts HTTP server
}
bootstrap();
