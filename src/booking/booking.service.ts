import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Booking, BookingStatus } from './schema/booking.schema';
import { Hotel } from '../hotel/schema/hotel.schema';
import { CreateBookingDto } from './dto/createbooking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,

    @InjectModel(Hotel.name)
    private hotelModel: Model<Hotel>,
  ) {}


  async create(userId: string, dto: CreateBookingDto) {
    const hotel = await this.hotelModel.findById(dto.hotelId);

    if (!hotel) throw new NotFoundException('Hotel not found');

    if (hotel.availableRooms < dto.roomsBooked) {
      throw new BadRequestException('Not enough rooms available');
    }

    const days =
      (new Date(dto.checkOut).getTime() -
        new Date(dto.checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    if (days <= 0) {
      throw new BadRequestException('Invalid check-in/check-out dates');
    }

    const totalPrice = days * hotel.pricePerNight * dto.roomsBooked;

  
    hotel.availableRooms -= dto.roomsBooked;
    await hotel.save();

    const booking = await this.bookingModel.create({
      user: userId,
      hotel: hotel._id,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      roomsBooked: dto.roomsBooked,
      totalPrice,
    });

    return {
      message: 'Booking confirmed',
      booking,
    };
  }


  async getUserBookings(userId: string) {
    return this.bookingModel
      .find({ user: userId })
      .populate('hotel')
      .sort({ createdAt: -1 });
  }

  //  Admin: Get All Bookings
  async getAllBookings() {
    return this.bookingModel
      .find()
      .populate('user')
      .populate('hotel')
      .sort({ createdAt: -1 });
  }

 
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.user.toString() !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Already cancelled');
    }

    const hotel = await this.hotelModel.findById(booking.hotel);

    if (hotel) {
      hotel.availableRooms += booking.roomsBooked;
      await hotel.save();
    }

    booking.status = BookingStatus.CANCELLED;
    await booking.save();

    return { message: 'Booking cancelled successfully' };
  }
}