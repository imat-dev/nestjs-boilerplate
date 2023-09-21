import { registerAs } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';

export default registerAs(
  'mailer.config',
  (): MailerOptions => ({
    transport: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
      },
    },
    defaults: {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    },
    template: {
      dir: process.cwd + '/templates/email',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
);
