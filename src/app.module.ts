import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './common/config/database/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfigProd from './common/config/database/orm.config.prod';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import eventEmitterConfig from './common/config/event.emitter/event.emitter.config';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerConfig from './common/config/mailer/mailer.config';
import mailerConfigProd from './common/config/mailer/mailer.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, mailerConfig],
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV ?? ''}.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    MailerModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? mailerConfig : mailerConfigProd,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    EventEmitterModule.forRoot(eventEmitterConfig),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
