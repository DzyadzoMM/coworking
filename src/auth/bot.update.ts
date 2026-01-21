import { Update, Start, Ctx, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { BookingsService } from '../bookings/bookings.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly bookingsService: BookingsService,
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

  @Command('my_bookings')
  async getMyBookings(@Ctx() ctx: Context) {
    if (!ctx.from) return;

    const user = await this.userRepo.findOne({ 
      where: { telegramId: ctx.from.id.toString() } 
    });

    if (!user) {
      return ctx.reply('❌ Ваш акаунт не прив’язаний. Будь ласка, скористайтеся посиланням із пошти.');
    }

    const bookings = await this.bookingsService.findUserBookings(user.id);

    if (bookings.length === 0) {
      return ctx.reply('У вас поки немає активних бронювань.');
    }

    let message = '📅 **Ваші бронювання:**\n\n';
    
    bookings.forEach((b, index) => {
      const start = new Date(b.startTime).toLocaleString('uk-UA');
      const end = new Date(b.endTime).toLocaleString('uk-UA');
      
      message += `${index + 1}. 📍 **${b.workspace?.location?.name || 'Локація'}**\n`;
      message += `🪑 Місце: ${b.workspace?.name || 'Не вказано'}\n`;
      message += `⏰ ${start} — ${end}\n`;
      message += `--------------------------\n`;
    });

    await ctx.replyWithMarkdown(message);
  }
}
