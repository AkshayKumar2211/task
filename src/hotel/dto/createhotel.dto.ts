



export class CreateHotelDto {
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
  images: string[];
}