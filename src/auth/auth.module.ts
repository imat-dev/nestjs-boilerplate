import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../model/users/user.entity';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { UserEventsListener } from './events/user.events.listener';
import { MailerService } from 'src/common/services/mailer.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserEventsListener, MailerService],
  controllers: [AuthController],
})
export class AuthModule {}
