import { IsString, IsArray, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsArray()
  serviceIds: string[];

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsEmail()
  guestEmail: string;

  @IsString()
  guestPhone: string;
}
