import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { environment } from '../../environment';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRequestRecoverPasswordEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      to: environment.isDebug ? environment.debugEmail : email,
      subject: 'eCom Recover password',
      template: './src/templates/request-recover-password',
      context: { code },
    });
  }
}
