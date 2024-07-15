import { config } from '@/config';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerProvider {
  private readonly transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASSWORD } = config;

    this.transport = nodemailer.createTransport({
      host: MAILER_HOST,
      port: MAILER_PORT,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASSWORD,
      },
    });
  }

  async send(options: Mail.Options) {
    return this.transport.sendMail({ ...this.defaultMailOptions, ...options });
  }

  async recoveryPasswordCode(code: string, email: string) {
    const template = fs.readFileSync(
      './src/providers/mailer/templates/recoveryPassword.html',
      'utf-8',
    );

    const html = template.replace('{{code}}', code);

    return this.transport.sendMail({
      ...this.defaultMailOptions,
      to: email,
      subject: 'Your recovery password code',
      html,
    });
  }

  private defaultMailOptions: Mail.Options = {
    from: {
      address: 'mailtrap@demomailtrap.com',
      name: 'Product',
    },
  };
}
