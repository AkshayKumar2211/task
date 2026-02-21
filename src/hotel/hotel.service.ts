import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateHotelDto } from './dto/createhotel.dto';
import * as fs from 'fs';
import { Hotel } from './schema/hotel.schema';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) {}


  async create(data: CreateHotelDto & { images: string[] }){
    try {

        if(!data)
        {
            throw new BadRequestException("Provide all the neccesaary data");
        }
        const hotel= await this.hotelModel.create(data);
        if(!hotel)
        {
            throw new BadRequestException("Failed to create the hotel");
        }

        return 
        {
            message:"Hotel created successfully";
        }
    } catch (error) {
        throw new Error();
    }
  }

 
  async findAll(): Promise<Hotel[]> {
    return await this.hotelModel.find().sort({ createdAt: -1 });
  }

 
  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelModel.findById(id);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }


  async remove(id: string): Promise<{ message: string }> {
    const hotel = await this.hotelModel.findById(id);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // delete images from disk
    if (hotel.images && hotel.images.length > 0) {
      hotel.images.forEach((path) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });
    }

    await this.hotelModel.findByIdAndDelete(id);

    return { message: 'Hotel deleted successfully' };
  }



  async update(
  id: string,
  updateDto: UpdateHotelDto & { newImages?: string[] },
): Promise<Hotel> {

  const hotel = await this.hotelModel.findById(id);

  if (!hotel) {
    throw new NotFoundException('Hotel not found');
  }

  // Remove selected images
  if (updateDto.removedImages && updateDto.removedImages.length > 0) {
    updateDto.removedImages.forEach((imgPath) => {
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath); // delete from disk
      }
    });
    if(updateDto.removedImages)
    {
    hotel.images = hotel.images.filter(
      (img) => !updateDto.removedImages?.includes(img),
    );
   }
  }

  
  if (updateDto.newImages && updateDto.newImages.length > 0) {
    hotel.images = [...hotel.images, ...updateDto.newImages];
  }


  Object.assign(hotel, updateDto);

  await hotel.save();

  return hotel;
}
}