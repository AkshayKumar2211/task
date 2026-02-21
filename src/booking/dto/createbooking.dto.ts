export class CreateBookingDto {
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  roomsBooked: number;
}