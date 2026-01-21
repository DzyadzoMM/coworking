import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async makeBooking(
    @Request() req,
    @Body('workspaceId') workspaceId: number,
    @Body('start') start: string,
    @Body('end') end: string,
  ) {
    const userId = req.user.userId; 
    
    return this.bookingsService.createBooking(
      userId, 
      workspaceId, 
      new Date(start), 
      new Date(end)
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('my')
async getMyBookings(@Request() req) {
  const userId = req.user.userId || req.user.userId; 
  return await this.bookingsService.findUserBookings(userId);
}
}
