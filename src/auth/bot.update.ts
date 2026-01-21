import { Update, Start, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Update()
export class BotUpdate {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (!ctx.from) return;

    const message = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const parts = message.split(' ');
    const token = parts.length > 1 ? parts[1] : null;

    if (!token) {
      return ctx.reply('Будь ласка, скористайтеся посиланням з вашої пошти або кабінету.');
    }

    const user = await this.userRepo.findOne({ where: { telegramToken: token } });

    if (!user) {
      return ctx.reply('❌ Посилання недійсне або термін його дії вичерпано.');
    }

    await this.userRepo.update(user.id, {
      telegramId: ctx.from.id.toString(),
      telegramToken: null, 
    });

    const name = user.firstName || 'користувач';
    await ctx.reply(`✅ Вітаємо, ${name}! Ваш акаунт підключено. Тепер ви отримуватимете сповіщення сюди.`);
  }
}
