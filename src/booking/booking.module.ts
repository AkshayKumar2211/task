import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { Hotel, HotelSchema } from 'src/hotel/schema/hotel.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Booking.name,schema:BookingSchema}])
,MongooseModule.forFeature([{name:Hotel.name,schema:HotelSchema}])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
