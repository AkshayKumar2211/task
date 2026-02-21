import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  pricePerNight: number;

  @Prop({ required: true })
  totalRooms: number;

  @Prop({ required: true })
  availableRooms: number;

  @Prop({ type: [String] })
  images: string[];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);