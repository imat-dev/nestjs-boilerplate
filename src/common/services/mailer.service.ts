import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface MailServiceContent {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class MailerService {
  readonly from: string;
  readonly templatePath: string;

  constructor(private readonly configService: ConfigService) {
    this.templatePath = this.configService.get<string>('MAIL_TEMPLATE_DIR');
    this.from = `${this.configService.get<string>(
      'SENDGRID_FROM_NAME',
    )} <${this.configService.get<string>('SENDGRID_FROM_EMAIL')}>`;
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_KEY'));
  }

  async send(mailContent: MailServiceContent) {
    const mail = {
      to: mailContent.to,
      subject: mailContent.subject,
      from: this.from,
      text: mailContent.body,
      html: mailContent.body,
    };

    const transport = await SendGrid.send(mail);
    return transport;
  }

  buildMailTemplate(bodyTemplatePath: string, data: any): string {
    const header = fs.readFileSync(
      path.join(this.templatePath, '/layout/header.hbs'),
      'utf8',
    );
    handlebars.registerPartial('header', header);

    // Read and register the footer partial
    const footer = fs.readFileSync(
      path.join(this.templatePath, '/layout/footer.hbs'),
      'utf8',
    );
    handlebars.registerPartial('footer', footer);

    // Read and register the body partial
    const body = fs.readFileSync(
      path.join(this.templatePath, bodyTemplatePath),
      'utf8',
    );
    handlebars.registerPartial('body', body);

    const main = fs.readFileSync(
      path.join(this.templatePath, '/layout/main.hbs'),
      'utf8',
    );
    const template = handlebars.compile(main);
    const html = template(data);

    return html;
  }
}
