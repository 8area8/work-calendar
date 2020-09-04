/**
 * Represent a Day object.
 */
interface IDay {
  id: number;
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
}

/**
 * Calendar class
 */
class Calendar implements ICalendar {
  public now = new Date();
  public selector = new Date();
  public days = [];
  public maxDaysInWeek = 7;

  /**
   * Get the short names of the days, according to your locale.
   *
   * @returns {string[]} a list of day names.
   *
   * French example: ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]
   */
  public getWeekDayNames(): string[] {
    let name = "";
    const dayNames = [];
    const date = new Date();

    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }

    for (let i = 0; i < 7; i++) {
      name = date.toLocaleDateString("default", {
        weekday: "short"
      });
      dayNames.push(name.slice(0, -1).toUpperCase());
      date.setDate(date.getDate() + 1);
    }
    return dayNames;
  }

  /**
   * Get the selected year.
   *
   * @returns {number}
   */
  getYear(): number {
    return this.selector.getFullYear();
  }

  /**
   * Get the selected month.
   *
   * @returns {number}
   */
  getMonth(): number {
    return this.selector.getMonth();
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
    const date = new Date(this.getYear(), this.getMonth() + 1, 0);
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

  /**
   * Get a string format "day-YYYY-MM-DD" from a given Day.
   *
   * @param {IDay} day The given Day.
   *
   * @returns {string}
   */
  getStringDate(day: IDay): string {
    return `day-${day.year}-${String(day.month).padStart(2, "0")}-${String(
      day.number
    ).padStart(2, "0")}`;
  }

  /**
   * Return true if the given day is the active day.
   *
   * @param {IDay} day The given Day.
   *
   * @returns {boolean}
   */
  isActiveDay(day: IDay): boolean {
    return (
      day.number === this.now.getDate() &&
      day.year === this.now.getFullYear() &&
      day.month === this.now.getMonth()
    );
  }

  /**
   * Return true if the given day is in the current month.
   *
   * @param {IDay} day the given Day.
   *
   * @returns {boolean}
   */
  isInMonth(day: IDay): boolean {
    return day.month === this.getMonth();
  }

  /**
   * Return true if the month of the day is further the database limit.
   *
   * @param {IDay} day
   *
   * @returns {boolean}
   */
  isOverDatabaseLimit(day: IDay): boolean {
    const monthDiff = day.month - this.now.getMonth();
    return Math.abs(monthDiff) >= 2 || day.year !== this.now.getFullYear();
  }

  /**
   * Get the days of the current month.
   * Returns a list of Days.
   *
   * @returns {IDay[]} return the days attribute.
   */
  getDays(): IDay[] {
    this.days = [];

    const startDate = new Date(this.getYear(), this.getMonth(), 1);
    const endDate = new Date(this.getYear(), this.getMonth() + 1, 0);

    const startWeekDate = new Date(
      this.getYear(),
      this.getMonth(),
      1 - (this.getWeekDay(startDate) - 1)
    );
    const endWeekDate = new Date(
      this.getYear(),
      this.getMonth(),
      endDate.getDate() + this.maxDaysInWeek - this.getWeekDay(endDate)
    );

    const date = new Date(startWeekDate.valueOf());
    // eslint-disable-next-line no-unmodified-loop-condition
    while (date <= endWeekDate) {
      this.days.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        number: date.getDate()
      });
      date.setDate(date.getDate() + 1);
    }
    return this.days;
  }

  /**
   * Select a new month.
   *
   * @param {number} difference the desired difference from the current month.
   *
   * @returns {void}
   */
  setMonth(difference: number): void {
    this.selector.setMonth(this.getMonth() + difference);
    this.getDays();
  }

  /**
   * Select a new year.
   *
   * @param {number} difference the desired difference from the current year.
   *
   * @returns {void}
   */
  setYear(difference: number): void {
    this.selector.setFullYear(this.getYear() + difference);
    this.getDays();
  }
}

// eslint-disable-next-line no-undef
export { IDay, IWork, ICalendar, Calendar };
