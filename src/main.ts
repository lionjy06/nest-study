import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'exception.filter';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    session({
      name: 'testSession',
      secret: '1234',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('practice')
    .setDescription('be nested')
    .setVersion('1.0')
    .addTag('nest practice')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
