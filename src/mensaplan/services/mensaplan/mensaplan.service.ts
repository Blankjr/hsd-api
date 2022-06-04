import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as parser from 'xml2json';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class MensaplanService {
  constructor(private http: HttpService) {}

  // fileUrl: the absolute url of the image or video you want to download
  // downloadFolder: the path of the downloaded file on your machine
  downloadFile = async (fileUrl, downloadFolder) => {
    // Get the file name
    const fileName = path.basename(fileUrl);
    // The path of the downloaded file on our machine
    const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
    try {
      const response: any = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream',
      });

      const w = response.data.pipe(fs.createWriteStream(localFilePath));
      w.on('finish', () => {
        console.log('Successfully downloaded file!');
      });
    } catch (err) {
      throw new Error(err);
    }
  };
  updateFood(xmlUrl, downloadLocation) {
    this.downloadFile(xmlUrl, downloadLocation);
  }
  getFood(downloadLocation) {
    return this.baseParse(downloadLocation);
  }
  baseParse(downloadLocation) {
    const xmlFile = fs.readFileSync(downloadLocation);
    const json = parser.toJson(xmlFile);
    const locationMensaHSD = '3.530';
    let parsedJSON = JSON.parse(json);
    parsedJSON = parsedJSON.DATAPACKET.ROWDATA.ROW;
    const hsdFiltered = parsedJSON.filter(
      (entry) => entry.VERBRAUCHSORT == locationMensaHSD,
    );
    return hsdFiltered;
  }
  getFoodToday(downloadLocation) {
    const hsdFiltered = this.baseParse(downloadLocation);
    const now: Date = new Date();
    const today: string = this.dateBuilder(now);
    return hsdFiltered.filter((entry) => entry.DATUM === today);
  }
  dateBuilder(now) {
    const day = now;
    const dd: string = String(day.getDate()).padStart(2, '0');
    const mm: string = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = day.getFullYear();
    const date: string = dd + '.' + mm + '.' + yyyy;
    return date;
  }
  getFoodWeekday(downloadLocation, weekday: string) {
    const hsdFiltered = this.baseParse(downloadLocation);
    const today: Date = new Date();
    const mondayCalendarDay =
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    const monday = new Date(today.setDate(mondayCalendarDay));
    const requiredDay = new Date(
      monday.setDate(monday.getDate() + this.weekdayHelper(weekday)),
    );
    const requiredDayString: string = this.dateBuilder(requiredDay);
    return hsdFiltered.filter((entry) => entry.DATUM === requiredDayString);
  }
  weekdayHelper(weekday: string): number {
    switch (weekday) {
      case 'tuesday':
        return 1;
        break;
      case 'wednesday':
        return 2;
        break;
      case 'thursday':
        return 3;
        break;
      case 'friday':
        return 4;
        break;
      default:
        return 0;
        break;
    }
  }
  findFoodById(downloadLocation, id: string) {
    return this.baseParse(downloadLocation).find(
      (food) => food.DISPO_ID === id,
    );
  }
}
