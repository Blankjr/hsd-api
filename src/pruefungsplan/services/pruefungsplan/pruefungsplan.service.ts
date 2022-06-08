import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
@Injectable()
export class PruefungsplanService {
  getAll(csvFile) {
    // return 'csv received';
    return this.baseParse(csvFile);
  }
  baseParse(downloadLocation) {
    const csvFile = fs.readFileSync(downloadLocation);
    // const obj = JSON.parse(csvFile);
    console.log(csvFile.toString());
    return csvFile.toString();
  }
}
