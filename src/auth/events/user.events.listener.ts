import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEvents } from './user.events';
import { User } from '@sentry/node';
import { MailerService } from 'src/common/services/mailer.service';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class UserEventsListener {
  private readonly logger = new Logger(UserEventsListener.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.created')
  async handleUserRegisteredEvent(user: User) {
    const subject = 'Welcome to our Website';
    const body = this.mailerService.buildMailTemplate('/users/new.user.hbs', {
      user: user,
      title: subject,
    });

    const mail = {
      to: 'raymart.marasigan@gmail.com',
      subject: subject,
      body: body,
    };

    const mailer = await this.mailerService.send(mail);
  }
}
