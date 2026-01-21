import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';
import { User } from '../users/user.entity';
import { BotUpdate } from './bot.update'; 

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret', 
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    NotificationService, 
    BotUpdate 
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
