import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import * as parser from 'xml2json';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class MensaplanService {
  constructor(private http: HttpService) {}
  getQuotes() {
    return this.http
      .get('https://catfact.ninja/fact')
      .pipe(map((response) => response.data));
  }

  // fileUrl: the absolute url of the image or video you want to download
  // downloadFolder: the path of the downloaded file on your machine
  downloadFile = async (fileUrl, downloadFolder) => {
    // Get the file name
    const fileName = path.basename(fileUrl);
    console.log(fileName);

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

  food = [
    {
      id: 3029,
      date: '2022-05-10',
      name: 'Spaghetti',
      price: {
        student: 0.5,
        employee: 0.7,
        guest: 0.7,
      },
    },
    {
      id: 3030,
      date: '2022-05-10',
      name: 'Risotto',
      price: {
        student: 0.9,
        employee: 1.5,
        guest: 1.5,
      },
    },
    {
      id: 3031,
      date: '2022-05-10',
      name: 'Pizza',
      price: {
        student: 4.5,
        employee: 6,
        guest: 6,
      },
    },
  ];

  findFoodById(id: number) {
    return this.food.find((food) => food.id === id);
  }
}
