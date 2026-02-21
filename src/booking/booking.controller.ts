import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/schema/user.schema';
import { CreateBookingDto } from './dto/createbooking.dto';


@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

 
  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(req.user.id, dto);
  }


  @UseGuards(AuthGuard)
  @Get('my')
  getMyBookings(@Request() req) {
    return this.bookingService.getUserBookings(req.user.id);
  }

 
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get()
  getAll() {
    return this.bookingService.getAllBookings();
  }

 
  @UseGuards(AuthGuard)
  @Delete(':id')
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingService.cancelBooking(id, req.user.id);
  }
}