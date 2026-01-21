import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Telegraf, Context } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async sendTelegramInvite(email: string, name: string) {
    try {
      const token = uuidv4();
      
      await this.userRepo.update({ email }, { telegramToken: token });

      const link = `https://t.me/News_UkBot?start=${token}`;

      this.logger.log(`ПРОЦЕС: Відправка листа для ${name} на адресу ${email}`);

      await this.mailerService.sendMail({
        to: String(email).trim(), 
        subject: 'Підключення сповіщень Coworking',
        template: './welcome',
        context: { 
          name: name, 
          link: link 
        },
      });

      this.logger.log(`УСПІХ: Лист для ${email} передано в чергу SMTP`);
      return { success: true };
    } catch (error) {
      this.logger.error(`КРИТИЧНА ПОМИЛКА SMTP: ${error.message}`);
      throw error;
    }
  }

  async sendDirectMessage(telegramId: string, text: string) {
    try {
      await this.bot.telegram.sendMessage(telegramId, text);
    } catch (e) {
      this.logger.error(`Помилка Telegram: ${e.message}`);
    }
  }
}
