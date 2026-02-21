import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateHotelDto } from './dto/createhotel.dto';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createHotelDto: CreateHotelDto,
  ) {
    const imagePaths = files.map((file) => file.path);

    return this.hotelService.create({
      ...createHotelDto,
      images: imagePaths,
    });
  }


  @Get()
  async getAllHotels()
  {
    try {
       return await this.hotelService.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  



@Put(':id')
@UseInterceptors(
  FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: string,
  @UploadedFiles() files: Express.Multer.File[],
  @Body() updateDto: UpdateHotelDto,
) {

  const newImages = files?.map((file) => file.path) || [];

  return this.hotelService.update(id, {
    ...updateDto,
    newImages,
  });
}


@Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hotelService.findOne(id);
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.hotelService.remove(id);
  }
  
}
