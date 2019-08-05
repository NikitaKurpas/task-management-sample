import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { FactoryProvider } from '@nestjs/common/interfaces';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { HandlebarsAdapter, TemplateMailMessage } from './handlebars.adapter';

type TemplateOptions = CompileOptions & {
  dir: string;
};

type MailModuleOptions = SMTPConnection.Options & {
  template: TemplateOptions;
  defaults: Mail.Options;
};

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    const transporterProvider: FactoryProvider = {
      provide: Mail,
      useFactory: () => {
        const transporter = createTransport(options);
        const hbsAdapter = new HandlebarsAdapter(
          options.template.dir,
          options.template,
        );
        transporter.use('compile', (mail, callback) => {
          if (mail.data.html) {
            return callback();
          }

          hbsAdapter.compile(mail as TemplateMailMessage, callback);
        });
        return transporter;
      },
    };

    return {
      module: MailModule,
      providers: [transporterProvider],
    };
  }
}
