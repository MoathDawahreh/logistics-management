import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // TODO: create env constants
        user: this.config.get('EMAIL'), //'vuedalebot@gmail.com',
        pass: this.config.get('EMAIL_PASS'), //'igew rhuv xsjr pnot',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.get('EMAIL'),
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
