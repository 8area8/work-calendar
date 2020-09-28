import { IEmployee } from "./worker";

/**
 * Represent a Day object.
 */
interface IDay {
  id: number | null;
  year: number;
  month: number;
  number: number;
  works: IWorkDate[];
}

interface IWork {
  id: number | null;
  employee: number;
  day: number;
  start: string | Date;
  end: string | Date;
}

export interface IWorkDate {
  id: number | null;
  day: number;
  employee: number;
  start: Date;
  end: Date;
}

interface ICalendar {
  now: Date;
  selector: Date;
  days: IDay[];
  maxDaysInWeek: number;

  /**
   * Get the short names of the days, according to your locale.
   *
   * @returns {string[]} a list of day names.
   *
   * French example: ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]
   */
  getWeekDayNames: () => string[];
  /**
   * Return the number of the last day of the selected month.
   *
   * @returns {number} Example for august 2020 : 31
   */
  getLastDayOfTheMonth: () => number;
  /**
   * Get the week day of the specified date, from monday (1) to sunday (7).
   *
   * @param {Date} date The wanted date.
   *
   * @returns {number}
   */
  getWeekDay: (date: Date) => number;
  getDays: () => IDay[];
}

/**
 * Calendar class
 */
class Calendar implements ICalendar {
  public days: IDay[] = [];
  public readonly now: Date = new Date();
  public readonly selector: Date = new Date();
  public readonly maxDaysInWeek: number = 7;

  private _weekDayNames: string[] = [];

  public getWeekDayNames(): string[] {
    if (!this._weekDayNames.length) {
      let name = "";
      const date = new Date();

      while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
      }

      for (let i = 0; i < 7; i++) {
        name = date.toLocaleDateString("default", {
          weekday: "short",
        });
        this._weekDayNames.push(name.slice(0, -1).toUpperCase());
        date.setDate(date.getDate() + 1);
      }
    }
    return [...this._weekDayNames];
  }

  getLastDayOfTheMonth(): number {
    const date = new Date(
      this.selector.getFullYear(),
      this.selector.getMonth() + 1,
      0
    );
    return date.getDate();
  }

  getWeekDay(date: Date): number {
    const number = date.getDay();
    return number === 0 ? 7 : number;
  }

  setMonth(difference: number): void {
    this.selector.setMonth(this.selector.getMonth() + difference);
    this.getDays();
  }

  setYear(difference: number): void {
    this.selector.setFullYear(this.selector.getFullYear() + difference);
    this.getDays();
  }

  getDays(): IDay[] {
    this.days = [];

    const startDate = new Date(
      this.selector.getFullYear(),
      this.selector.getMonth(),
      1
    );
    const endDate = new Date(
      this.selector.getFullYear(),
      this.selector.getMonth(),
      this.getLastDayOfTheMonth()
    );

    const startWeekDate = new Date(
      this.selector.getFullYear(),
      this.selector.getMonth(),
      1 - (this.getWeekDay(startDate) - 1)
    );
    const endWeekDate = new Date(
      this.selector.getFullYear(),
      this.selector.getMonth(),
      endDate.getDate() + this.maxDaysInWeek - this.getWeekDay(endDate)
    );

    const date = new Date(startWeekDate.valueOf());
    // eslint-disable-next-line no-unmodified-loop-condition
    while (date <= endWeekDate) {
      this.days.push({
        id: null,
        works: [],
        year: date.getFullYear(),
        month: date.getMonth(),
        number: date.getDate(),
      });
      date.setDate(date.getDate() + 1);
    }
    return this.days;
  }
}

// eslint-disable-next-line no-undef
export { IDay, IWork, ICalendar, Calendar };
