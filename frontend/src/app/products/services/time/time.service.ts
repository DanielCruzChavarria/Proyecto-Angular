import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  public timeZone = 'America/New_York';

  constructor() {}
  // Convierte  fecha a formato local
  toLocalDate(date: string | Date): string {
    return this.convertDate(date, 'yyyy-MM-dd');
  }

  // Convierte fecha y hora a formato local
  toLocalDateTime(date: string | Date): string {
    return this.convertDate(date, 'yyyy-MM-dd HH:mm:ss ZZZ');
  }

  // Método genérico para conversión de fechas
  private convertDate(date: string | Date, format: string): string {
    if (date instanceof Date) {
      return DateTime.fromJSDate(date, { zone: this.timeZone }).toFormat(format);
    } else {
      return DateTime.fromISO(date.toString(), { zone: this.timeZone }).toFormat(format);
    }
  }
}
