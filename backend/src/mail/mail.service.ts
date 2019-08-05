import { Injectable } from '@nestjs/common';
import Mail, { Options } from 'nodemailer/lib/mailer';

export type TemplateMailOptions = Options & {
  template?: string;
  context?: any;
};

@Injectable()
export class MailService {
  constructor(private readonly transporter: Mail) {}

  async sendMail(options: TemplateMailOptions): Promise<void> {
    return this.transporter.sendMail(options);
  }
}
