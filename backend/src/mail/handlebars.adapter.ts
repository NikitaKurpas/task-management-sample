import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import MailMessage from 'nodemailer/lib/mailer/mail-message';
import { TemplateMailOptions } from './mail.service';

export type TemplateMailMessage = MailMessage & {
  data: TemplateMailOptions;
};

// Taken from https://github.com/nest-modules/mailer/blob/master/lib/adapters/handlebars.adapter.ts
export class HandlebarsAdapter {
  constructor(
    private readonly dir: string,
    private readonly options?: CompileOptions,
  ) {}

  private precompiledTemplates: {
    [name: string]: handlebars.TemplateDelegate;
  } = {};

  public compile(
    mail: TemplateMailMessage,
    callback: (err?: Error) => void,
  ): void {
    const templateExt = path.extname(mail.data.template) || '.hbs';
    const templateName = path.basename(
      mail.data.template,
      path.extname(mail.data.template),
    );
    const templateDir =
      path.dirname(mail.data.template) !== '.'
        ? path.dirname(mail.data.template)
        : this.dir;
    const templatePath = path.join(templateDir, templateName + templateExt);

    if (!this.precompiledTemplates[templateName]) {
      try {
        const template = fs.readFileSync(templatePath, 'utf-8');
        this.precompiledTemplates[templateName] = handlebars.compile(
          template,
          this.options,
        );
      } catch (err) {
        return callback(err);
      }
    }

    mail.data.html = this.precompiledTemplates[templateName](mail.data.context);

    return callback();
  }
}
