import { PartialType } from "@nestjs/mapped-types";
import { CreateHotelDto } from "./createhotel.dto";


export class UpdateHotelDto extends PartialType(CreateHotelDto) {
  removedImages?: string[];   
}