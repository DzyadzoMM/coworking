import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { AuthModule } from './auth/auth.module';
import {LoggerMiddleware} from './middleware/logger.middlware';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TelegrafModule } from 'nestjs-telegraf';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRoot({token:String(process.env.TELEGRAM_TOKEN) }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_CODE,
          },
        },
        defaults: {
          from: '"Coworking" <vash_email@gmail.com>'},
        template: {
          dir: join(__dirname,'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,},
        },
    }),
    UsersModule, 
    BookingsModule, 
    WorkspacesModule, 
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
