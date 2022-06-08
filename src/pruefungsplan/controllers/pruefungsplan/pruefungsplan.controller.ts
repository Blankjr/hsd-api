import { Controller, Get } from '@nestjs/common';
import { PruefungsplanService } from 'src/pruefungsplan/services/pruefungsplan/pruefungsplan.service';

@Controller('pruefungsplan')
export class PruefungsplanController {
  FILE_LOCATION = process.cwd() + '/public/data';
  constructor(private pruefungsplanService: PruefungsplanService) {}
  @Get('all')
  async getFood() {
    return this.pruefungsplanService.getAll(
      this.FILE_LOCATION + '/pruefung.json',
    );
  }
}
