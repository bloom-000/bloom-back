import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRequestRecoverPasswordEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'eCom Recover password',
      template: './src/templates/request-recover-password',
      context: { code },
    });
  }
}
