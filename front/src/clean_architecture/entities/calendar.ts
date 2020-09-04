/**
 * Represent a Day object.
 */
interface IDay {
  id: number | null;
  year: number;
  month: number;
  number: number;
}

interface IWork {
  id: number;
  employeeId: number;
  dayId: number;
  start: string;
  end: string;
}

interface ICalendar {
  now: Date;
  selector: Date;
  days: IDay[];
  maxDaysInWeek: number;

  getWeekDayNames: () => string[];
  getMonthName: () => string;
  getMonthLen: () => number;
  getWeekDay: (date: Date) => number;
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

  /**
   * Get the short names of the days, according to your locale.
   *
   * @returns {string[]} a list of day names.
   *
   * French example: ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]
   */
  public getWeekDayNames(): string[] {
    if (!this._weekDayNames.length) {
      let name = "";
      const date = new Date();

      while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
      }

      for (let i = 0; i < 7; i++) {
        name = date.toLocaleDateString("default", {
          weekday: "short"
        });
        this._weekDayNames.push(name.slice(0, -1).toUpperCase());
        date.setDate(date.getDate() + 1);
      }
    }
    return this._weekDayNames;
  }

  /**
   * Get the selected month name.
   *
   * @returns {string}
   */
  getMonthName(): string {
    const name = this.selector.toLocaleDateString("default", {
      month: "long"
    });
    return name[0].toUpperCase() + name.slice(1);
  }

  /**
   * Return the number of the last day of the selected month.
   *
   * @returns {number} Example for august 2020 : 31
   */
  getMonthLen(): number {
    const date = new Date(
      this.selector.getFullYear(),
      this.selector.getMonth() + 1,
      0
    );
    return date.getDate();
  }

  /**
   * Get the week day of the specified date, from monday (1) to sunday (7).
   *
   * @param {Date} date The wanted date.
   *
   * @returns {number}
   */
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
      this.selector.getMonth() + 1,
      0
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
        year: date.getFullYear(),
        month: date.getMonth(),
        number: date.getDate()
      });
      date.setDate(date.getDate() + 1);
    }
    return this.days;
  }
}

// eslint-disable-next-line no-undef
export { IDay, IWork, ICalendar, Calendar };
