import { TestBed } from '@angular/core/testing';

import { TimeService } from './time.service';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert date string to local date', () => {
    service.timeZone = 'America/New_York';
    const dateStr = '2022-07-25T14:30:00.000Z';
    const expectedResult = '2022-07-25';
    expect(service.toLocalDate(dateStr)).toBe(expectedResult);
  });

  it('should convert date object to local date', () => {
    service.timeZone = 'America/New_York';
    const date = new Date('2022-07-25T14:30:00.000Z');
    const expectedResult = '2022-07-25';
    expect(service.toLocalDate(date)).toBe(expectedResult);
  });

  it('should convert date string to local date time', () => {
    service.timeZone = 'America/New_York';
    const dateStr = '2022-07-25T14:30:00.000Z';
    const expectedResult = '2022-07-25 10:30:00 -0400';
    expect(service.toLocalDateTime(dateStr)).toBe(expectedResult);
  });

  it('should convert date object to local date time', () => {
    service.timeZone = 'America/New_York';
    const date = new Date('2022-07-25T14:30:00.000Z');
    const expectedResult = '2022-07-25 10:30:00 -0400';
    expect(service.toLocalDateTime(date)).toBe(expectedResult);
  });
});
