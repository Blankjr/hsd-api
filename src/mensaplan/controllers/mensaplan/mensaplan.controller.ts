import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  Res,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { MensaplanService } from 'src/mensaplan/services/mensaplan/mensaplan.service';
import { Cron } from '@nestjs/schedule';

@Controller('mensaplan')
export class MensaplanController {
  XML_URL =
    'https://medien.hs-duesseldorf.de/service/mensaplan/Documents/app_all.xml';
  DOWNLOAD_LOCATION = process.cwd() + '/public/data';
  constructor(private mensaplanService: MensaplanService) {}

  @Get('search/:id')
  getMensaplanById(@Param('id', ParseIntPipe) id: number) {
    const food = this.mensaplanService.findFoodById(id);
    if (food) return food;
    else throw new HttpException('Food Not Found!', HttpStatus.BAD_REQUEST);
  }
  @Get('test')
  getTest() {
    return this.mensaplanService.getQuotes();
  }
  @Cron('0 4,6,8,10 * * 1') // Every Monday at 4:00,  6:00, 8:00AM, 10:00AM
  updateFood() {
    return this.mensaplanService.updateFood(
      this.XML_URL,
      this.DOWNLOAD_LOCATION,
    );
  }
  @Get('all')
  async getFood() {
    return this.mensaplanService.getFood(
      this.DOWNLOAD_LOCATION + '/app_all.xml',
    );
  }
  @Get('today')
  async getFoodToday() {
    return this.mensaplanService.getFoodToday(
      this.DOWNLOAD_LOCATION + '/app_all.xml',
    );
  }
  @Get('weekday/:weekday')
  async getFoodMonday(@Param('weekday') weekday) {
    console.log(weekday);

    return this.mensaplanService.getFoodWeekday(
      this.DOWNLOAD_LOCATION + '/app_all.xml',
      weekday,
    );
  }
}
