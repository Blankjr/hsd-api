import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvToJson from 'convert-csv-to-json';
@Injectable()
export class PruefungsplanService {
  async loadData(jsonLocation: string, csvLocation: string) {
    try {
      if (!fs.existsSync(jsonLocation))
        csvToJson
          .latin1Encoding()
          .generateJsonFileFromCsv(csvLocation, jsonLocation);
    } catch (err) {
      console.error(err);
    }
  }

  async getData(jsonLocation: string) {
    try {
      return fs.existsSync(jsonLocation) ? this.baseParse(jsonLocation) : null;
    } catch (err) {
      console.error(err);
    }
  }

  private baseParse(jsonLocation: string) {
    const jsonObject = fs.readFileSync(jsonLocation);
    return jsonObject.toString();
  }
}
