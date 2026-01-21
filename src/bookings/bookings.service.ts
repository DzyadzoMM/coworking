import { Injectable, Inject, forwardRef, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Booking } from './booking.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @Inject(forwardRef(() => NotificationService)) 
    private notificationService: NotificationService,
  ) {}

  async createBooking(userId: number, workspaceId: number, start: Date, end: Date) {
    const overlapping = await this.bookingRepo.findOne({
      where: {
        workspace: { id: workspaceId },
        status: 'active',
        startTime: LessThanOrEqual(end),
        endTime: MoreThanOrEqual(start),
      },
    });
    if (overlapping) throw new ConflictException('Місце зайняте');

    const booking = await this.bookingRepo.save(
      this.bookingRepo.create({ user: { id: userId }, workspace: { id: workspaceId }, startTime: start, endTime: end })
    );

    const full = await this.bookingRepo.findOne({
      where: { id: booking.id },
      relations: ['user', 'workspace', 'workspace.location'],
    });

    if (full?.user?.telegramId) {
      const msg = 
      `✅ *БРОНЮВАННЯ ПІДТВЕРДЖЕНО*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📍 *Локація:* ${full.workspace.location.name}\n` +
      `🏠 *Адреса:* ${full.workspace.location.address || 'Адреса не вказана'}\n` +
      `🪑 *Місце:* ${full.workspace.name} (${full.workspace.type || 'Стіл'})\n` +
      `📅 *Дата:* ${new Date(full.startTime).toLocaleDateString('uk-UA')}\n` +
      `⏰ *Час:* ${new Date(full.startTime).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})} — ` +
      `${new Date(full.endTime).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💡 _Ви можете переглянути всі свої бронювання командою /my_bookings`;
      await this.notificationService.sendDirectMessage(full.user.telegramId, msg).catch(e => console.error(e));
    }
    return booking;
  }

  async findUserBookings(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['workspace', 'workspace.location'],
      order: { startTime: 'DESC' },
    });
  }
}
